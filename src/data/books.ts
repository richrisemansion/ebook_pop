import type { Book, CategoryInfo, AgeCategory } from '@/types';

export const categories: CategoryInfo[] = [
  {
    id: 'baby',
    name: 'Baby',
    nameTh: 'วัยทารก',
    ageRange: '0-2 ปี',
    color: '#FF006E',
    bgColor: '#FF006E',
    description: 'เข้าใจโลกของลูกน้อยในช่วงปีแรก'
  },
  {
    id: 'preschool',
    name: 'Preschool',
    nameTh: 'วัยอนุบาล',
    ageRange: '3-5 ปี',
    color: '#FFBE0B',
    bgColor: '#FFBE0B',
    description: 'สนับสนุนความอยากรู้อยากเห็นและการเรียนรู้'
  },
  {
    id: 'elementary',
    name: 'Elementary',
    nameTh: 'วัยประถม',
    ageRange: '6-9 ปี',
    color: '#06FFA5',
    bgColor: '#06FFA5',
    description: 'สร้างความมั่นใจและนิสัยการเรียนรู้'
  },
  {
    id: 'preteen',
    name: 'Pre-teen',
    nameTh: 'วัยก่อนวัยรุ่น',
    ageRange: '10-12 ปี',
    color: '#8338EC',
    bgColor: '#8338EC',
    description: 'รับมือกับการเปลี่ยนแปลงและสร้างเป้าหมาย'
  }
];

export const books: Book[] = [
  // วัยทารก (0-2 ปี)
  {
    id: 'baby-1',
    title: 'จิตวิทยาลึกลับของทารก',
    subtitle: 'Psychology of Babies',
    description: 'ค้นพบโลกที่ซ่อนอยู่ในจิตใจของทารก เข้าใจว่าลูกน้อยคิดและรู้สึกอย่างไร ทำไมเขาถึงร้องไห้ หัวเราะ และสนใจสิ่งต่างๆ รอบตัว',
    price: 299,
    originalPrice: 399,
    image: '/images/book-0-1.jpg',
    pdfUrl: '/pdfs/psychology-of-babies.pdf',
    category: 'baby',
    ageRange: '0-2 ปี',
    pages: 128,
    rating: 4.8,
    reviews: 156,
    features: [
      'เข้าใจพัฒนาการสมองทารก',
      'เทคนิคการสื่อสารกับลูกน้อย',
      'วิธีสร้างความผูกพันที่ดี',
      'คำแนะนำจากนักจิตวิทยาเด็ก'
    ],
    isBestseller: true
  },
  {
    id: 'baby-2',
    title: 'ก่อนวัยอนุบาล สมองต้องการอะไร',
    subtitle: 'What Brains Need Before Preschool',
    description: 'สมองของทารกพัฒนารวดเร็วที่สุดในช่วง 0-2 ปี หนังสือเล่มนี้จะบอกคุณว่าควรทำอย่างไรเพื่อกระตุ้นพัฒนาการที่เหมาะสม',
    price: 349,
    image: '/images/book-0-2.jpg',
    pdfUrl: '/pdfs/what-brains-need.html',
    category: 'baby',
    ageRange: '0-2 ปี',
    pages: 156,
    rating: 4.9,
    reviews: 203,
    features: [
      'กิจกรรมกระตุ้นสมอง 50 อย่าง',
      'อาหารที่ช่วยพัฒนาสมอง',
      'การนอนที่เหมาะสม',
      'ของเล่นที่ควรมี'
    ],
    isNew: true
  },
  {
    id: 'baby-3',
    title: 'ร้องไห้คือภาษา',
    subtitle: 'Crying is a Language',
    description: 'ทารกไม่สามารถพูดได้ แต่เขาสื่อสารผ่านการร้องไห้ เรียนรู้ที่จะ "ฟัง" และเข้าใจว่าลูกต้องการอะไร',
    price: 279,
    image: '/images/book-0-3.jpg',
    pdfUrl: '/pdfs/crying-is-language.html',
    category: 'baby',
    ageRange: '0-2 ปี',
    pages: 112,
    rating: 4.7,
    reviews: 189,
    features: [
      'ถอดรหัสเสียงร้อง 5 ประเภท',
      'วิธี calming ที่ได้ผล',
      'เมื่อไหร่ควรกังวล',
      'เทคนิคจากพยาบาลเด็ก'
    ]
  },

  // วัยอนุบาล (3-5 ปี)
  {
    id: 'preschool-1',
    title: 'จิตใจน้อยๆ ที่อยากรู้อยากเห็น',
    subtitle: 'Little Minds Full of Curiosity',
    description: 'ช่วงวัยนี้เด็กเต็มไปด้วยคำถาม "ทำไม" หนังสือเล่มนี้จะช่วยคุณสนับสนุนความอยากรู้อยากเห็นอย่างถูกวิธี',
    price: 329,
    originalPrice: 399,
    image: '/images/book-3-1.jpg',
    pdfUrl: '/pdfs/little-minds-curiosity.html',
    category: 'preschool',
    ageRange: '3-5 ปี',
    pages: 144,
    rating: 4.8,
    reviews: 167,
    features: [
      'ตอบคำถาม "ทำไม" อย่างสร้างสรรค์',
      'กิจกรรมสำรวจธรรมชาติ',
      'การเล่านิทานที่กระตุ้นจินตนาการ',
      'วิธีตอบคำถามยากๆ'
    ],
    isBestseller: true
  },
  {
    id: 'preschool-2',
    title: 'เมื่อลูกโต้เถียง',
    subtitle: 'When Kids Argue',
    description: 'เด็กวัยนี้เริ่มมีความคิดเป็นของตัวเอง และมักจะโต้เถียง เรียนรู้วิธีจัดการกับอารมณ์และตั้งขอบเขตที่เหมาะสม',
    price: 299,
    image: '/images/book-3-2.jpg',
    pdfUrl: '/pdfs/when-kids-argue.html',
    category: 'preschool',
    ageRange: '3-5 ปี',
    pages: 132,
    rating: 4.6,
    reviews: 145,
    features: [
      'เข้าใจอารมณ์ของเด็ก',
      'เทคนิคการตั้งขอบเขต',
      'วิธีจัดการ tantrum',
      'การสื่อสารแบบบวก'
    ]
  },
  {
    id: 'preschool-3',
    title: 'เล่นแล้วฉลาด',
    subtitle: 'Play Makes You Smart',
    description: 'การเล่นคือการเรียนรู้ที่ดีที่สุดสำหรับเด็ก ค้นพบวิธีเล่นที่ช่วยพัฒนาทักษะต่างๆ อย่างมีประสิทธิภาพ',
    price: 359,
    image: '/images/book-3-3.jpg',
    pdfUrl: '/pdfs/play-makes-smart.html',
    category: 'preschool',
    ageRange: '3-5 ปี',
    pages: 168,
    rating: 4.9,
    reviews: 234,
    features: [
      'เกมพัฒนาทักษะ 100 เกม',
      'ของเล่น DIY งบประหยัด',
      'การเล่นกลุ่มและการแบ่งปัน',
      'เล่นอย่างไรให้ปลอดภัย'
    ],
    isNew: true
  },

  // วัยประถม (6-9 ปี)
  {
    id: 'elementary-1',
    title: 'ความมั่นใจเริ่มต้นที่บ้าน',
    subtitle: 'Confidence Starts at Home',
    description: 'ความมั่นใจในตนเองเป็นพื้นฐานของความสำเร็จ เรียนรู้วิธีสร้างและเสริมสร้างความมั่นใจให้ลูก',
    price: 379,
    originalPrice: 459,
    image: '/images/book-6-1.jpg',
    pdfUrl: '/pdfs/confidence-starts-home.html',
    category: 'elementary',
    ageRange: '6-9 ปี',
    pages: 176,
    rating: 4.8,
    reviews: 198,
    features: [
      'เทคนิคสร้างความมั่นใจ',
      'วิธีรับมือกับความล้มเหลว',
      'การชมที่มีประสิทธิภาพ',
      'สร้าง growth mindset'
    ],
    isBestseller: true
  },
  {
    id: 'elementary-2',
    title: 'เมื่อลูกไม่อยากไปโรงเรียน',
    subtitle: 'When Kids Don\'t Want School',
    description: 'ปัญหาการปรับตัวในโรงเรียนเป็นเรื่องปกติ หนังสือเล่มนี้จะช่วยคุณเข้าใจและแก้ไขปัญหาร่วมกับลูก',
    price: 349,
    image: '/images/book-6-2.jpg',
    pdfUrl: '/pdfs/when-kids-dont-want-school.html',
    category: 'elementary',
    ageRange: '6-9 ปี',
    pages: 152,
    rating: 4.7,
    reviews: 176,
    features: [
      'หาสาเหตุที่แท้จริง',
      'เทคนิคการปรับตัว',
      'การสื่อสารกับครู',
      'วิธีสร้างความสุขในการเรียน'
    ]
  },
  {
    id: 'elementary-3',
    title: 'จิตวิทยาของการบ้าน',
    subtitle: 'Psychology of Homework',
    description: 'การบ้านไม่ใช่เรื่องน่าเบื่ออีกต่อไป เรียนรู้วิธีสร้างนิสัยการเรียนรู้และจัดการเวลาอย่างมีประสิทธิภาพ',
    price: 329,
    image: '/images/book-6-3.jpg',
    pdfUrl: '/pdfs/psychology-homework.html',
    category: 'elementary',
    ageRange: '6-9 ปี',
    pages: 144,
    rating: 4.6,
    reviews: 134,
    features: [
      'สร้างมุมเรียนรู้ที่บ้าน',
      'เทคนิคจัดการเวลา',
      'วิธีจดจ่อและไม่วอกแวก',
      'รางวัลที่เหมาะสม'
    ]
  },

  // วัยก่อนวัยรุ่น (10-12 ปี)
  {
    id: 'preteen-1',
    title: 'เข้าใจวัยเปลี่ยน',
    subtitle: 'Understanding Puberty',
    description: 'วัยเปลี่ยนคือช่วงเวลาที่เต็มไปด้วยการเปลี่ยนแปลง หนังสือเล่มนี้จะช่วยคุณเข้าใจและสนับสนุนลูกในช่วงเวลาสำคัญนี้',
    price: 399,
    originalPrice: 499,
    image: '/images/book-10-1.jpg',
    pdfUrl: '/pdfs/understanding-puberty.html',
    category: 'preteen',
    ageRange: '10-12 ปี',
    pages: 192,
    rating: 4.9,
    reviews: 267,
    features: [
      'เปลี่ยนแปลงทางร่างกายและอารมณ์',
      'วิธีพูดคุยเรื่องลำบากใจ',
      'การให้พื้นที่ส่วนตัว',
      'สร้างความไว้วางใจ'
    ],
    isBestseller: true
  },
  {
    id: 'preteen-2',
    title: 'โซเชียลมีเดียกับจิตใจวัยรุ่น',
    subtitle: 'Social Media and Teen Minds',
    description: 'โลกดิจิตอลมีทั้งข้อดีและข้อเสีย เรียนรู้วิธีช่วยลูกใช้เทคโนโลยีอย่างสมดุลและปลอดภัย',
    price: 379,
    image: '/images/book-10-2.jpg',
    pdfUrl: '/pdfs/social-media-teen-minds.html',
    category: 'preteen',
    ageRange: '10-12 ปี',
    pages: 168,
    rating: 4.8,
    reviews: 223,
    features: [
      'ตั้งกฎการใช้โซเชียลมีเดีย',
      'รับมือกับ cyberbullying',
      'สร้าง digital wellness',
      'ความเป็นส่วนตัวออนไลน์'
    ],
    isNew: true
  },
  {
    id: 'preteen-3',
    title: 'ความฝันและเป้าหมาย',
    subtitle: 'Dreams and Goals',
    description: 'ช่วงวัยนี้เป็นเวลาที่ดีในการสร้างความฝันและเป้าหมาย สนับสนุนลูกให้กล้าฝันและลงมือทำ',
    price: 359,
    image: '/images/book-10-3.jpg',
    pdfUrl: '/pdfs/dreams-and-goals.html',
    category: 'preteen',
    ageRange: '10-12 ปี',
    pages: 156,
    rating: 4.7,
    reviews: 189,
    features: [
      'เทคนิคตั้งเป้าหมาย SMART',
      'วิธีรับมือกับความล้มเหลว',
      'ค้นหาความถนัด',
      'สร้างแรงบันดาลใจ'
    ]
  }
];

export const getBooksByCategory = (category: AgeCategory): Book[] => {
  return books.filter(book => book.category === category);
};

export const getBookById = (id: string): Book | undefined => {
  return books.find(book => book.id === id);
};

export const getFeaturedBooks = (): Book[] => {
  return books.filter(book => book.isBestseller || book.isNew).slice(0, 6);
};

export const getCategoryById = (id: AgeCategory): CategoryInfo | undefined => {
  return categories.find(cat => cat.id === id);
};
