# # Node.js 환경
# FROM node:20

# # 작업 디렉토리 설정
# WORKDIR /app

# # package.json과 package-lock.json 복사
# COPY package*.json ./

# # 의존성 설치
# RUN npm install

# # 앱 소스 복사
# COPY . .

# # React 앱 빌드
# RUN npm run build

# Node.js 환경
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# React 앱 빌드
RUN npm run build

# 🔥 dist를 컨테이너 → 호스트로 동기화되도록 유지
#   (compose에 의해 host의 ./app/dist와 매핑됨)
RUN cp -r dist /app/dist
