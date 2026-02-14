import json
import os
import psycopg2
from decimal import Decimal

SCHEMA = 't_p90313977_education_center_web'

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400'
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
    '''Публичный API для получения данных на главную страницу — преподаватели, предметы, расписание, отзывы, контакты'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': '', 'isBase64Encoded': False}
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    qp = event.get('queryStringParameters', {}) or {}
    entity = qp.get('entity', '')
    
    table_map = {
        'teachers': ('teachers', "SELECT * FROM {schema}.teachers ORDER BY sort_order, id"),
        'subjects': ('subjects', "SELECT * FROM {schema}.subjects ORDER BY id"),
        'schedule': ('schedule', "SELECT * FROM {schema}.schedule ORDER BY sort_order, id"),
        'contacts': ('contacts', "SELECT * FROM {schema}.contacts ORDER BY sort_order, id"),
        'reviews': ('reviews', "SELECT * FROM {schema}.reviews WHERE is_published = true ORDER BY sort_order, id"),
        'results': ('results', "SELECT * FROM {schema}.results ORDER BY sort_order, id"),
    }
    
    if entity not in table_map:
        return {
            'statusCode': 400,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Unknown entity: {entity}'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    query = table_map[entity][1].format(schema=SCHEMA)
    cur.execute(query)
    result = rows_to_dicts(cur)
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(result),
        'isBase64Encoded': False
    }
