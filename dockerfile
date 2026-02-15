# Menggunakan Node.js versi 20 berbasis Alpine (ringan)
FROM node:20-alpine

# Menentukan direktori kerja
WORKDIR /app

# Menyalin file konfigurasi npm terlebih dahulu
COPY package*.json ./


# Ubah baris ini untuk memperpanjang waktu timeout jaringan hingga 1000 detik
RUN npm install --network-timeout=1000000

# Menyalin seluruh source code React kamu
COPY . .

# Membuka port bawaan Vite
EXPOSE 5173

# Menjalankan Vite dengan flag --host agar bisa diakses dari luar container
CMD ["npm", "run", "dev", "--", "--host"]