import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Сохранение заявки на занятие от ученика
    Принимает: student_name, student_phone, student_email, selected_teacher, selected_subject, selected_time
    Возвращает: успешное сохранение или ошибку
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
        
        student_name = body_data.get('student_name', '')
        student_phone = body_data.get('student_phone', '')
        student_email = body_data.get('student_email', '')
        selected_teacher = body_data.get('selected_teacher', '')
        selected_subject = body_data.get('selected_subject', '')
        selected_time = body_data.get('selected_time', '')
        
        if not student_name or not student_phone:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Student name and phone are required'}),
                'isBase64Encoded': False
            }
        
        db_url = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        query = """
            INSERT INTO t_p90313977_education_center_web.student_bookings 
            (student_name, student_phone, student_email, selected_teacher, selected_subject, selected_time, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """
        
        cur.execute(query, (
            student_name,
            student_phone,
            student_email,
            selected_teacher,
            selected_subject,
            selected_time,
            'new'
        ))
        
        booking_id = cur.fetchone()[0]
        conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': True,
                'booking_id': booking_id,
                'message': 'Заявка успешно отправлена'
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
