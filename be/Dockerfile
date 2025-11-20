FROM python:3.10

# 작업 디렉토리 생성 및 이동
WORKDIR /app

# 프로젝트 파일 복사
COPY . .

# pip 최신화 + 의존성 설치
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

RUN python manage.py collectstatic --noinput

# ✅ Daphne로 변경!
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "config.asgi:application"]