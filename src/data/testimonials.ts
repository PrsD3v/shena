import type { Testimonial } from "@/types/coach";

export const TESTIMONIALS = [
  {
    id: "testimonial-1",
    authorName: "سارا م.",
    cityId: "tehran",
    text: "قبلاً برای پیدا کردن مربی شنا کلی پیام و تماس داشتم. اینجا قیمت و سابقه و نظرات را یک‌جا دیدم.",
  },
  {
    id: "testimonial-2",
    authorName: "رضا ک.",
    cityId: "karaj",
    text: "فیلتر شهر و سطح باعث شد فقط گزینه‌های مناسب خودم را ببینم و وقت کمتری تلف کنم.",
  },
  {
    id: "testimonial-3",
    authorName: "مینا ب.",
    cityId: "isfahan",
    text: "توضیح‌های پروفایل مربی‌ها واقعی و بدون اغراق بود. می‌شد قبل از رزرو تصمیم گرفت.",
  },
  {
    id: "testimonial-4",
    authorName: "حسین ن.",
    cityId: "mashhad",
    text: "رزرو جلسه در چند دقیقه انجام شد و بعدش همه‌چیز در پنل خودم بود.",
  },
  {
    id: "testimonial-5",
    authorName: "پریسا ص.",
    cityId: "shiraz",
    text: "برای انتخاب مربی بانوان، دیدن گواهی‌ها و محل تمرین خیلی کمک کرد.",
  },
] satisfies readonly Testimonial[];
