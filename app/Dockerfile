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

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# 🔥 dist를 host에 전달하기 위해 /build 디렉토리에 복사
RUN cp -r dist /build