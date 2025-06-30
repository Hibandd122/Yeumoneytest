from app import app

def handler(request, context):
    # Chạy Flask app khi function được gọi
    return app(request.environ, start_response)
