# FROM python:3.10

# # 작업 디렉토리 생성 및 이동
# WORKDIR /app

# # 프로젝트 파일 복사
# COPY . .

# # pip 최신화 + 의존성 설치
# RUN pip install --upgrade pip \
#     && pip install -r requirements.txt

# RUN python manage.py collectstatic --noinput

# # ✅ Daphne로 변경!
# CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "config.asgi:application"]

FROM python:3.10

# cron 설치
RUN apt-get update && apt-get install -y cron

# 작업 디렉토리 설정
WORKDIR /app

# 프로젝트 복사
COPY . .

# pip 설치
RUN pip install --upgrade pip && pip install -r requirements.txt

# 정적 파일 모으기
RUN python manage.py collectstatic --noinput

# cron 로그 파일 생성
RUN touch /var/log/cron.log

# 컨테이너 실행 시:
# 1) cronjob 등록
# 2) cron 데몬 실행
# 3) Daphne 실행
CMD python manage.py crontab add && \
    cron && \
    daphne -b 0.0.0.0 -p 8000 config.asgi:application
