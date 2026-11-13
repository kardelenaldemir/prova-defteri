import { addDays, localDateKey } from './domain'
import type { AppData, Customer, Fitting } from './types'

export const DEMO_NOTICE = 'Örnek kayıtlar tamamen kurgusaldır. Kendi kayıtlarınızı ekleyebilirsiniz.'

/** A fresh copy per call; dates follow the user's local calendar. */
export function createSeedData(today = localDateKey()): AppData {
  const customers: Customer[] = [
    { id: 'customer-deniz', name: 'Deniz Arslan', phone: '', weddingDate: addDays(today, 24), notes: 'Sade bir görünüm istiyor. Tül ve dantel örneklerini birlikte inceleyeceğiz.' },
    { id: 'customer-selin', name: 'Selin Yılmaz', phone: '', weddingDate: addDays(today, 42), notes: 'A kesim model üzerinde çalışılıyor. Provaları sabah tercih ediyor.' },
    { id: 'customer-elif', name: 'Elif Kaya', phone: '', weddingDate: addDays(today, 12), notes: 'Son provaya ayakkabılarıyla gelecek.' },
    { id: 'customer-ipek', name: 'İpek Demir', phone: '', weddingDate: addDays(today, 55), notes: 'Uzun duvak ve çıkarılabilir kol alternatiflerine bakılacak.' },
    { id: 'customer-ece', name: 'Ece Yıldız', phone: '', weddingDate: addDays(today, 36), notes: 'İnci detayları için iki örnek hazırlanacak.' },
    { id: 'customer-melis', name: 'Melis Aydın', phone: '', weddingDate: addDays(today, 9), notes: 'Etek boyu ayakkabı yüksekliğine göre son kez kontrol edildi.' },
    { id: 'customer-asli', name: 'Aslı Koç', phone: '', weddingDate: addDays(today, 20), notes: 'Bel oturuşu ve sırt kapaması ara provada gözden geçirilecek.' },
    { id: 'customer-zeynep', name: 'Zeynep Aydın', phone: '', weddingDate: addDays(today, 68), notes: 'Saten kumaş alternatiflerini ilk provada inceleyeceğiz.' },
  ]
  const fittings: Fitting[] = [
    {
      id: 'fitting-deniz', customerId: 'customer-deniz', date: today, time: '10:00', durationMinutes: 60,
      type: 'İlk prova', status: 'Planlandı', dress: 'İpek saten', notes: 'Omuz çizgisini ve etek akışını kontrol edelim.',
      adjustments: [{ id: 'adjustment-deniz-1', label: 'Etek boyu işaretlenecek', done: true }, { id: 'adjustment-deniz-2', label: 'Bel ölçüsü kontrol edilecek', done: false }, { id: 'adjustment-deniz-3', label: 'Askı boyu ayarlanacak', done: false }],
    },
    {
      id: 'fitting-selin', customerId: 'customer-selin', date: today, time: '11:30', durationMinutes: 60,
      type: 'Son prova', status: 'Planlandı', dress: 'Dantel işlemeli', notes: 'Teslim öncesi son görünümü birlikte kontrol edelim.',
      adjustments: [{ id: 'adjustment-selin-1', label: 'Beden ölçülerini kontrol et', done: false }, { id: 'adjustment-selin-2', label: 'Etek hacmini kontrol et', done: false }, { id: 'adjustment-selin-3', label: 'Dantel birleşimlerini kontrol et', done: false }],
    },
    {
      id: 'fitting-elif', customerId: 'customer-elif', date: today, time: '14:00', durationMinutes: 45,
      type: 'Ara prova', status: 'Tamamlandı', dress: 'A kesim', notes: 'Bel ve etek kontrolleri tamamlandı. Son provada duvakla birlikte denenecek.',
      adjustments: [{ id: 'adjustment-elif-1', label: 'Bel oturuşunu kontrol et', done: true }, { id: 'adjustment-elif-2', label: 'Etek boyunu kontrol et', done: true }, { id: 'adjustment-elif-3', label: 'Askı boyunu ayarla', done: true }],
    },
    {
      id: 'fitting-ipek', customerId: 'customer-ipek', date: addDays(today, 1), time: '10:30', durationMinutes: 60,
      type: 'İlk prova', status: 'Planlandı', dress: 'Organze · prenses kesim', notes: 'Çıkarılabilir kollar için iki alternatif hazır.',
      adjustments: [{ id: 'adjustment-ipek-1', label: 'İlk beden ölçüsünü al', done: false }, { id: 'adjustment-ipek-2', label: 'Kol örneklerini dene', done: false }],
    },
    {
      id: 'fitting-ece', customerId: 'customer-ece', date: addDays(today, 4), time: '13:00', durationMinutes: 60,
      type: 'Ara prova', status: 'Planlandı', dress: 'Mikado · A kesim', notes: 'İnci örnekleri arasından seçim yapılacak.',
      adjustments: [{ id: 'adjustment-ece-1', label: 'İnci detayını netleştir', done: false }],
    },
    {
      id: 'fitting-melis', customerId: 'customer-melis', date: addDays(today, 5), time: '15:00', durationMinutes: 60,
      type: 'Son prova', status: 'Planlandı', dress: 'Tül · romantik kesim', notes: 'Teslim öncesi son kontroller birlikte yapılacak.',
      adjustments: [{ id: 'adjustment-melis-1', label: 'Etek ucunu kontrol et', done: false }],
    },
    {
      id: 'fitting-asli', customerId: 'customer-asli', date: addDays(today, 7), time: '11:00', durationMinutes: 60,
      type: 'Ara prova', status: 'Planlandı', dress: 'Krep · sade kesim', notes: 'Bel ve sırt düzeltmeleri kontrol edilecek.',
      adjustments: [{ id: 'adjustment-asli-1', label: 'Sırt kapamasını ayarla', done: false }],
    },
    {
      id: 'fitting-zeynep', customerId: 'customer-zeynep', date: addDays(today, 3), time: '14:00', durationMinutes: 60,
      type: 'İlk prova', status: 'Planlandı', dress: 'Saten · özel tasarım', notes: 'İlk beden ölçüleri ve kumaş seçimi birlikte yapılacak.',
      adjustments: [{ id: 'adjustment-zeynep-1', label: 'Kumaş seçimini netleştir', done: false }],
    },
  ]
  return { version: 1, customers, fittings }
}
