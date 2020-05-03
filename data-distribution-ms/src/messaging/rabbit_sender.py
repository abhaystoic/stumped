import pika

credentials = pika.PlainCredentials('admin', 'admin123')
connection = pika.BlockingConnection(pika.ConnectionParameters(
  'headlines-ms', 5672, '/', credentials))
channel = connection.channel()
channel.queue_declare(queue='hello')
channel.basic_publish(
  exchange='', routing_key='hello', body='Hello World!')
print(" [x] Sent 'Hello World!'")
connection.close()
