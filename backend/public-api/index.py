import json
import os
import psycopg2
from decimal import Decimal
from typing import Dict, Any, List

def get_db_connection():
    '''Создание подключения к базе данных'''
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    conn.autocommit = False
    return conn

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Публичный API для получения данных на главную страницу
    GET /public-api?entity=teachers - получить преподавателей
    GET /public-api?entity=schedule - получить расписание
    GET /public-api?entity=contacts - получить контакты
    GET /public-api?entity=reviews - получить отзывы
    '''
    method: str = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters', {}) or {}
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    conn = None
    cur = None
    
    try:
        entity = query_params.get('entity', '')
        
        conn = get_db_connection()
        cur = conn.cursor()
        
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
        'contacts': 'contacts',
        'reviews': 'reviews'
    }
    
    table = table_map.get(entity)
    if not table:
        raise ValueError(f'Unknown entity: {entity}')
    
    if entity == 'teachers':
        query = f"SELECT * FROM t_p90313977_education_center_web.{table} WHERE name IS NOT NULL ORDER BY id"
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