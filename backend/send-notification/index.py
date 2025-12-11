import json
import os
import requests
from typing import Dict, Any

def send_telegram_notification(chat_id: str, message: str) -> bool:
    '''Отправка уведомления в Telegram'''
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return False
    
    url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    data = {
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'HTML'
    }
    
    try:
        response = requests.post(url, json=data, timeout=10)
        return response.status_code == 200
    except Exception as e:
        print(f'Telegram error: {e}')
        return False

def send_email_notification(to_email: str, subject: str, message: str) -> bool:
    '''Отправка уведомления на email через SendGrid API'''
    sendgrid_api_key = os.environ.get('SENDGRID_API_KEY')
    if not sendgrid_api_key:
        return False
    
    url = 'https://api.sendgrid.com/v3/mail/send'
    headers = {
        'Authorization': f'Bearer {sendgrid_api_key}',
        'Content-Type': 'application/json'
    }
    
    data = {
        'personalizations': [{
            'to': [{'email': to_email}]
        }],
        'from': {'email': 'noreply@poehali.dev', 'name': 'Образовательный центр'},
        'subject': subject,
        'content': [{
            'type': 'text/html',
            'value': message
        }]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=10)
        return response.status_code == 202
    except Exception as e:
        print(f'Email error: {e}')
        return False

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Отправка уведомлений о новой заявке
    Принимает: booking_data с информацией о заявке, notification_settings
    Возвращает: результат отправки уведомлений
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        
        booking = body_data.get('booking', {})
        settings = body_data.get('settings', {})
        
        student_name = booking.get('student_name', '')
        student_phone = booking.get('student_phone', '')
        selected_subject = booking.get('selected_subject', '')
        selected_time = booking.get('selected_time', '')
        
        message = f'''
<b>🔔 Новая заявка на занятие!</b>

👤 <b>Ученик:</b> {student_name}
📞 <b>Телефон:</b> {student_phone}
📚 <b>Предмет:</b> {selected_subject}
🕐 <b>Время:</b> {selected_time}
'''
        
        results = {
            'telegram': False,
            'email': False
        }
        
        if settings.get('telegram', {}).get('enabled'):
            telegram_id = settings.get('telegram', {}).get('value')
            if telegram_id:
                results['telegram'] = send_telegram_notification(telegram_id, message)
        
        if settings.get('email', {}).get('enabled'):
            email = settings.get('email', {}).get('value')
            if email:
                email_message = message.replace('<b>', '<strong>').replace('</b>', '</strong>')
                results['email'] = send_email_notification(
                    email,
                    f'Новая заявка от {student_name}',
                    f'<html><body>{email_message}</body></html>'
                )
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': True,
                'results': results
            }),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
