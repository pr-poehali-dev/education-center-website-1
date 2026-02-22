import json
import os
import psycopg2
from decimal import Decimal

SCHEMA = 't_p90313977_education_center_web'

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-User-Id, X-Session-Id',
    'Access-Control-Max-Age': '86400'
}

TABLE_MAP = {
    'teachers': {
        'table': 'teachers',
        'fields': ['full_name', 'subject', 'experience_years', 'rating', 'phone', 'email', 'name', 'photo_url', 'description', 'specialization', 'experience', 'sort_order']
    },
    'subjects': {
        'table': 'subjects',
        'fields': ['name', 'exam_type']
    },
    'schedule': {
        'table': 'schedule',
        'fields': ['time', 'title', 'description', 'teacher_id', 'sort_order']
    },
    'contacts': {
        'table': 'contacts',
        'fields': ['type', 'value', 'icon', 'label', 'sort_order']
    },
    'reviews': {
        'table': 'reviews',
        'fields': ['author_name', 'author_photo', 'rating', 'review_text', 'date', 'is_published', 'sort_order']
    },
    'results': {
        'table': 'results',
        'fields': ['title', 'description', 'image_url', 'metric_value', 'metric_label', 'sort_order']
    },
    'bookings': {
        'table': 'student_bookings',
        'fields': ['student_name', 'student_phone', 'student_email', 'selected_teacher', 'selected_subject', 'selected_time', 'status']
    }
}

def check_auth(headers):
    token = headers.get('X-Authorization', headers.get('x-authorization', ''))
    return token.startswith('admin_')

def response(status, body):
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(body) if not isinstance(body, str) else body,
        'isBase64Encoded': False
    }

def serialize(val):
    if hasattr(val, 'isoformat'):
        return val.isoformat()
    if isinstance(val, Decimal):
        return float(val)
    return val

def rows_to_dicts(cur):
    columns = [d[0] for d in cur.description]
    return [{col: serialize(row[i]) for i, col in enumerate(columns)} for row in cur.fetchall()]

def handler(event, context):
    '''API управления данными сайта — преподаватели, предметы, расписание, контакты, отзывы, заявки'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': '', 'isBase64Encoded': False}

    if not check_auth(event.get('headers', {})):
        return response(401, {'error': 'Unauthorized'})

    qp = event.get('queryStringParameters', {}) or {}
    entity = qp.get('entity', '')
    entity_id = qp.get('id', '')

    if entity not in TABLE_MAP:
        return response(400, {'error': f'Unknown entity: {entity}'})

    info = TABLE_MAP[entity]
    table = f"{SCHEMA}.{info['table']}"

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = False
    cur = conn.cursor()

    try:
        if method == 'GET':
            if entity_id:
                cur.execute(f"SELECT * FROM {table} WHERE id = %s", (entity_id,))
                rows = rows_to_dicts(cur)
                result = rows[0] if rows else {}
            else:
                has_sort = entity not in ('subjects', 'bookings')
                order = "ORDER BY COALESCE(sort_order, 0), id" if has_sort else "ORDER BY id"
                cur.execute(f"SELECT * FROM {table} {order}")
                result = rows_to_dicts(cur)
            cur.close()
            conn.close()
            return response(200, result)

        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cols = [f for f in info['fields'] if f in data and data[f] is not None]
            vals = [data[f] for f in cols]
            ph = ', '.join(['%s'] * len(cols))
            cur.execute(f"INSERT INTO {table} ({', '.join(cols)}) VALUES ({ph}) RETURNING id", vals)
            new_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            return response(201, {'id': new_id, 'success': True})

        elif method == 'PUT':
            if not entity_id:
                cur.close()
                conn.close()
                return response(400, {'error': 'id required'})
            data = json.loads(event.get('body', '{}'))
            cols = [f for f in info['fields'] if f in data]
            if not cols:
                cur.close()
                conn.close()
                return response(400, {'error': 'No fields to update'})
            sets = ', '.join([f"{c} = %s" for c in cols])
            vals = [data[c] for c in cols]
            vals.append(entity_id)
            cur.execute(f"UPDATE {table} SET {sets} WHERE id = %s", vals)
            conn.commit()
            cur.close()
            conn.close()
            return response(200, {'success': True})

        elif method == 'DELETE':
            if not entity_id:
                cur.close()
                conn.close()
                return response(400, {'error': 'id required'})
            cur.execute(f"DELETE FROM {table} WHERE id = %s", (entity_id,))
            conn.commit()
            cur.close()
            conn.close()
            return response(200, {'success': True})

        else:
            cur.close()
            conn.close()
            return response(405, {'error': 'Method not allowed'})

    except Exception as e:
        if cur:
            cur.close()
        if conn:
            conn.close()
        return response(500, {'error': str(e)})