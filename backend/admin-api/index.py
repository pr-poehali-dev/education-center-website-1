import json
import os
import psycopg2
from decimal import Decimal
from typing import Dict, Any, List, Optional

def check_auth(headers: Dict[str, Any]) -> bool:
    '''Проверка токена аутентификации'''
    auth_token = headers.get('X-Auth-Token', headers.get('x-auth-token', ''))
    return auth_token.startswith('admin_')

def get_db_connection():
    '''Создание подключения к базе данных'''
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    conn.autocommit = False
    return conn

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления данными администратором
    Поддерживает CRUD операции для всех сущностей:
    - /teachers - преподаватели
    - /schedule - расписание
    - /calendar - календарь событий
    - /contacts - контакты
    - /reviews - отзывы
    - /results - результаты
    - /bookings - заявки учеников
    '''
    method: str = event.get('httpMethod', 'GET')
    path_params = event.get('pathParams', {})
    query_params = event.get('queryStringParameters', {}) or {}
    headers = event.get('headers', {})
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if not check_auth(headers):
        return {
            'statusCode': 401,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    conn = None
    cur = None
    
    try:
        entity = query_params.get('entity', '')
        entity_id = query_params.get('id', '')
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            if entity_id:
                result = get_entity_by_id(cur, entity, entity_id)
            else:
                result = get_entities(cur, entity)
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            result = create_entity(cur, conn, entity, body_data)
            
            return {
                'statusCode': 201,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            result = update_entity(cur, conn, entity, entity_id, body_data)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        if cur:
            cur.close()
        if conn:
            conn.close()
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def get_entities(cur, entity: str) -> List[Dict]:
    '''Получение списка всех сущностей'''
    table_map = {
        'teachers': 'teachers',
        'schedule': 'schedule',
        'calendar': 'calendar_events',
        'contacts': 'contacts',
        'reviews': 'reviews',
        'results': 'results',
        'bookings': 'student_bookings',
        'notifications': 'notification_settings'
    }
    
    table = table_map.get(entity)
    if not table:
        raise ValueError(f'Unknown entity: {entity}')
    
    if entity == 'bookings':
        query = f"SELECT * FROM t_p90313977_education_center_web.{table} ORDER BY created_at DESC"
    elif entity == 'notifications':
        query = f"SELECT * FROM t_p90313977_education_center_web.{table} ORDER BY notification_type"
    else:
        query = f"SELECT * FROM t_p90313977_education_center_web.{table} ORDER BY id"
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    
    result = []
    for row in rows:
        row_dict = {}
        for i, col in enumerate(columns):
            val = row[i]
            if hasattr(val, 'isoformat'):
                val = val.isoformat()
            elif isinstance(val, Decimal):
                val = float(val)
            row_dict[col] = val
        result.append(row_dict)
    
    return result

def get_entity_by_id(cur, entity: str, entity_id: str) -> Dict:
    '''Получение одной сущности по ID'''
    table_map = {
        'teachers': 'teachers',
        'schedule': 'schedule',
        'calendar': 'calendar_events',
        'contacts': 'contacts',
        'reviews': 'reviews',
        'results': 'results',
        'bookings': 'student_bookings',
        'notifications': 'notification_settings'
    }
    
    table = table_map.get(entity)
    if not table:
        raise ValueError(f'Unknown entity: {entity}')
    
    query = f"SELECT * FROM t_p90313977_education_center_web.{table} WHERE id = %s"
    cur.execute(query, (entity_id,))
    columns = [desc[0] for desc in cur.description]
    row = cur.fetchone()
    
    if row:
        row_dict = {}
        for i, col in enumerate(columns):
            val = row[i]
            if hasattr(val, 'isoformat'):
                val = val.isoformat()
            elif isinstance(val, Decimal):
                val = float(val)
            row_dict[col] = val
        return row_dict
    return {}

def create_entity(cur, conn, entity: str, data: Dict) -> Dict:
    '''Создание новой сущности'''
    table_map = {
        'teachers': ('teachers', ['name', 'photo_url', 'description', 'specialization', 'experience', 'sort_order']),
        'schedule': ('schedule', ['time', 'title', 'description', 'teacher_id', 'sort_order']),
        'calendar': ('calendar_events', ['date', 'title', 'description', 'event_type', 'sort_order']),
        'contacts': ('contacts', ['type', 'value', 'icon', 'label', 'sort_order']),
        'reviews': ('reviews', ['author_name', 'author_photo', 'rating', 'review_text', 'date', 'is_published', 'sort_order']),
        'results': ('results', ['title', 'description', 'image_url', 'metric_value', 'metric_label', 'sort_order']),
        'bookings': ('student_bookings', ['student_name', 'student_phone', 'student_email', 'selected_teacher', 'selected_subject', 'selected_time', 'status'])
    }
    
    table_info = table_map.get(entity)
    if not table_info:
        raise ValueError(f'Unknown entity: {entity}')
    
    table, fields = table_info
    
    columns = [f for f in fields if f in data]
    values = [data[f] for f in columns]
    placeholders = ', '.join(['%s'] * len(columns))
    columns_str = ', '.join(columns)
    
    query = f"INSERT INTO t_p90313977_education_center_web.{table} ({columns_str}) VALUES ({placeholders}) RETURNING id"
    cur.execute(query, values)
    new_id = cur.fetchone()[0]
    conn.commit()
    
    return {'id': new_id, 'success': True}

def update_entity(cur, conn, entity: str, entity_id: str, data: Dict) -> Dict:
    '''Обновление существующей сущности'''
    table_map = {
        'teachers': ('teachers', ['name', 'photo_url', 'description', 'specialization', 'experience', 'sort_order']),
        'schedule': ('schedule', ['time', 'title', 'description', 'teacher_id', 'sort_order']),
        'calendar': ('calendar_events', ['date', 'title', 'description', 'event_type', 'sort_order']),
        'contacts': ('contacts', ['type', 'value', 'icon', 'label', 'sort_order']),
        'reviews': ('reviews', ['author_name', 'author_photo', 'rating', 'review_text', 'date', 'is_published', 'sort_order']),
        'results': ('results', ['title', 'description', 'image_url', 'metric_value', 'metric_label', 'sort_order']),
        'bookings': ('student_bookings', ['student_name', 'student_phone', 'student_email', 'selected_teacher', 'selected_subject', 'selected_time', 'status']),
        'notifications': ('notification_settings', ['notification_type', 'is_enabled', 'value'])
    }
    
    table_info = table_map.get(entity)
    if not table_info:
        raise ValueError(f'Unknown entity: {entity}')
    
    table, fields = table_info
    
    columns = [f for f in fields if f in data]
    values = [data[f] for f in columns]
    
    set_clause = ', '.join([f"{col} = %s" for col in columns])
    values.append(entity_id)
    
    query = f"UPDATE t_p90313977_education_center_web.{table} SET {set_clause}, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
    cur.execute(query, values)
    conn.commit()
    
    return {'success': True, 'updated': cur.rowcount}