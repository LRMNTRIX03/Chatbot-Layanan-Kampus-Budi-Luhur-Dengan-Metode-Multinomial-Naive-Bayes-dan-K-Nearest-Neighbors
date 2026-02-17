# Chatbot Layanan Kampus — Intent Classification dengan Multinomial Naive Bayes dan KNN

Project ini merupakan implementasi chatbot layanan kampus berbasis intent classification yang dikembangkan untuk membantu menjawab pertanyaan seputar informasi akademik dan layanan mahasiswa di Universitas Budi Luhur.

Sistem dibangun menggunakan pendekatan Natural Language Processing (NLP) dan Machine Learning dengan dua algoritma klasifikasi, yaitu Multinomial Naive Bayes (MNB) dan K-Nearest Neighbors (KNN). Project mencakup seluruh tahapan pemrosesan teks mulai dari preprocessing, ekstraksi fitur TF-IDF, training model, evaluasi performa, hingga antarmuka frontend untuk pengujian chatbot.

Model KNN pada project ini menggunakan cosine similarity sebagai metode perhitungan kedekatan antar vektor dokumen.

---

## Pendekatan Intent Classification

Chatbot menggunakan pendekatan intent classification, yaitu proses mengklasifikasikan pertanyaan pengguna ke dalam kategori intent tertentu yang merepresentasikan tujuan pertanyaan. Setiap intent memiliki kumpulan data latih berupa variasi kalimat serta respon jawaban yang sesuai.

Alur kerja sistem:

1. Pengguna mengirim pertanyaan
2. Teks diproses melalui tahapan preprocessing
3. Teks diubah menjadi representasi vektor menggunakan TF-IDF
4. Model melakukan klasifikasi intent menggunakan MNB dan KNN
5. Sistem mengambil respon berdasarkan intent hasil prediksi
6. Jawaban ditampilkan pada halaman chatbot

---

## Tahapan Pemrosesan Teks

Tahapan preprocessing yang digunakan meliputi:

* Case folding
* Pembersihan tanda baca, simbol, dan angka
* Normalisasi spasi
* Stopword removal Bahasa Indonesia
* Tokenisasi
* Stemming (opsional)

Tujuan tahap ini adalah menormalkan teks agar lebih konsisten dan siap diproses pada tahap ekstraksi fitur.

---

## Ekstraksi Fitur

Representasi teks dilakukan menggunakan metode TF-IDF (Term Frequency – Inverse Document Frequency). Metode ini mengubah dokumen menjadi vektor numerik dengan pembobotan kata berdasarkan tingkat kepentingannya dalam korpus.

---

## Model Klasifikasi

### Multinomial Naive Bayes

* Model probabilistik untuk klasifikasi teks
* Menggunakan prior dan likelihood kata per kelas
* Menggunakan Laplace smoothing
* Cocok untuk data berbasis frekuensi kata

### K-Nearest Neighbors

* Model berbasis jarak antar vektor dokumen
* Menggunakan cosine similarity untuk mengukur kedekatan
* Kelas ditentukan berdasarkan voting mayoritas dari k tetangga terdekat
* Nilai k dapat dikonfigurasi

---

## Evaluasi Model

Evaluasi performa model dilakukan menggunakan data testing dengan metrik berikut:

* Confusion matrix
* Accuracy
* Precision
* Recall
* F1-score
* Rata-rata metrik per kelas

Pembagian data training dan testing dilakukan secara stratified untuk menjaga distribusi kelas tetap seimbang.

---

## Frontend Chatbot

Project ini juga menyediakan antarmuka frontend sederhana yang digunakan untuk:

* Menguji pertanyaan secara langsung
* Menampilkan hasil prediksi intent
* Menampilkan respon chatbot berdasarkan intent
* Membandingkan hasil prediksi antar model

---

## Tujuan Project

* Membangun chatbot layanan kampus berbasis intent classification
* Mengimplementasikan pipeline NLP end-to-end
* Membandingkan performa Multinomial Naive Bayes dan KNN
* Menerapkan preprocessing dan TF-IDF pada data teks Bahasa Indonesia
* Menyediakan prototype sistem tanya jawab otomatis domain kampus

---

Dataset intent disertakan dalam folder repository project ini.
