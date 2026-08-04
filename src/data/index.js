export const navMenu = [
  {
    label: "Jewellery",
    slug: "all-jewellery",
    columns: [
      {
        heading: "Necklaces",
        items: ["Diamond Necklaces", "Polki Necklaces", "Gold Necklaces", "Chokers", "Polki Pendants"],
      },
      {
        heading: "Earrings",
        items: ["Diamond Earrings", "Polki Earrings", "Jhumkas", "Chandbalis", "Tops"],
      },
      {
        heading: "Rings",
        items: [
          "Diamond Rings",
          "Polki Rings",
          "Gold Rings",
          "Solitaire Rings",
          "Engagement Rings",
          "Cocktail Rings",
        ],
      },
      {
        heading: "More",
        items: ["Bracelets", "Bangles", "Maang Tikkas", "Bridal Sets", "Diamond Sets"],
      },
    ],
    featuredImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
  },
  {
    label: "Diamond",
    slug: "diamond-jewellery",
    columns: [
      {
        heading: "Shop Diamond",
        items: ["Diamond Necklaces", "Diamond Earrings", "Diamond Bangles", "Diamond Bracelets", "Diamond Rings"],
      },
    ],
    featuredImage: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop",
  },
  {
    label: "Polki",
    slug: "all-polki-jewellery",
    columns: [
      {
        heading: "Shop Polki",
        items: ["Polki Necklaces", "Polki Earrings", "Polki Rings", "Polki Bracelets", "Maang Tikkas", "Polki Sets"],
      },
    ],
    featuredImage: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop",
  },
  {
    label: "Ships in 3 Days",
    slug: "ready-to-ship",
    columns: [
      {
        heading: "Ready to Ship",
        items: ["Chokers", "Necklaces", "Jhumkas", "Long Earrings", "Bangles", "Rings"],
      },
    ],
    featuredImage: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
  },
  {
    label: "Bridal",
    slug: "bridal-jewellery",
    columns: [
      {
        heading: "Occasions",
        items: ["Engagement", "Mehndi", "Sangeet", "The Big Day", "Reception/Party"],
      },
    ],
    featuredImage: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=800&auto=format&fit=crop",
  },
  { label: "Stores", slug: "/stores", direct: true },
];

export const categoryStrip = [
  { name: "Necklaces", slug: "all-necklaces", img: "https://i.pinimg.com/vwebp/1200x/3b/62/a1/3b62a1d25021e8c773adbe14633aed0a.webp" },
  { name: "Earrings", slug: "polki-earrings", img: "https://i.pinimg.com/736x/c8/f9/98/c8f9982932822606c0857cf690cde1aa.jpg" },
  { name: "Rings", slug: "rings", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop" },
  { name: "Bracelets", slug: "bracelets-for-women", img: "https://i.pinimg.com/736x/4b/f6/e8/4bf6e8b4c04a52f86a4d46d5fb8f8fe5.jpg" },
  { name: "Accessories", slug: "polki-accessories", img: "https://i.pinimg.com/736x/01/08/7b/01087bb840b2bab2447dfbc4fbc288d3.jpg" },
  { name: "Sets", slug: "polki-diamond-jewellery-sets", img: "https://i.pinimg.com/736x/92/b8/31/92b831020e5d62d07ba3bf04bff90199.jpg" },
];

export const products = [
  {
    id: "dn00366",
    slug: "amiel-polki-diamond-choker",
    name: "Amiel Polki And Diamond Choker",
    celeb: "Kusha Kapila",
    price: 1125500,
    tag: "Ready to Ship",
    category: "Necklaces",
    isPolki: true,
    isDiamond: true,
    isBridal: true,
    images: [
      "https://i.pinimg.com/1200x/9c/20/7d/9c207d05ca45af599dc196782810306f.jpg",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop"
    ],
    description: "An opulent statement of royal aesthetics. The Amiel Polki Choker features hand-set uncut diamonds nested in solid 22KT gold, detailed with fine seed pearls and drop emeralds. Designed to drape elegantly, it is a masterwork of traditional Jadau craft, perfect for milestone celebrations.",
    specifications: {
      "Gold Purity": "22KT Hallmarked Gold",
      "Gold Weight": "64.20 gms",
      "Polki Weight": "18.40 cts",
      "Diamond Quality": "VVS-VS, EF Color",
      "Gemstones": "Natural emerald drops, pearls",
      "Certification": "SGL Certified Diamonds, BIS Hallmarked Gold"
    }
  },
  {
    id: "on30079",
    slug: "reem-polki-diamond-bead-pendant",
    name: "Reem Polki And Diamond Bead Pendant",
    celeb: "Maheep Kapoor",
    price: 1009100,
    tag: "Made to Order",
    category: "Necklaces",
    isPolki: true,
    isDiamond: true,
    images: [
      "https://i.pinimg.com/736x/44/7a/d7/447ad7022c2e3978555f99211a783773.jpg",
      "https://i.pinimg.com/736x/44/7a/d7/447ad7022c2e3978555f99211a783773.jpg"
    ],
    description: "The Reem Bead Pendant bridges the gap between ancestral legacy and modern glamour. Centered on a breathtaking, premium-grade uncut diamond medallion, the piece is suspended from a double strand of hand-strung natural tourmaline beads, bordered with brilliant-cut diamonds.",
    specifications: {
      "Gold Purity": "18KT Hallmarked Gold",
      "Gold Weight": "32.50 gms",
      "Polki Weight": "9.80 cts",
      "Diamond Weight": "2.15 cts",
      "Gemstones": "Natural tourmaline beads",
      "Certification": "SGL Certified"
    }
  },
  {
    id: "tn30123",
    slug: "alyssa-polki-necklace",
    name: "Alyssa Polki Necklace",
    celeb: "Shalini Pandey",
    price: 474100,
    tag: "Made to Order",
    category: "Necklaces",
    isPolki: true,
    images: [
      "https://i.pinimg.com/736x/2c/4c/8d/2c4c8d231d25044cc13c8cf835ffc781.jpg",
      "https://i.pinimg.com/736x/2c/4c/8d/2c4c8d231d25044cc13c8cf835ffc781.jpg"
    ],
    description: "Delicate yet regal, the Alyssa Polki Necklace is designed for contemporary brides. Crafted with sparkling glass-clear Polki diamonds using open-back setting techniques, it allows light to pass through each stone, creating a brilliant, ethereal glow.",
    specifications: {
      "Gold Purity": "22KT Hallmarked Gold",
      "Gold Weight": "28.10 gms",
      "Polki Weight": "11.20 cts",
      "Gemstones": "Premium pearls",
      "Certification": "SGL Certified"
    }
  },
  {
    id: "on30084",
    slug: "heena-polki-diamond-necklace",
    name: "Heena Polki And Diamond Necklace",
    celeb: "Kalki Koechlin",
    price: 1020800,
    tag: "Made to Order",
    category: "Necklaces",
    isPolki: true,
    isDiamond: true,
    isBridal: true,
    images: [
      "https://i.pinimg.com/vwebp/736x/0f/91/77/0f9177d65eabc190838aab1fa999189c.webp",
      "https://images.unsplash.com/photo-1758995115682-1452a1a9e35b?q=80&w=800&auto=format&fit=crop"
    ],
    description: "A showstopping creation featuring floral arrays of syndicate Polki diamonds. Framed by a halo of micro-paved brilliant diamonds, this necklace showcases an intricate openwork pattern in 18KT white and yellow gold, resulting in an elegant drape and majestic sparkle.",
    specifications: {
      "Gold Purity": "18KT Gold",
      "Gold Weight": "47.80 gms",
      "Polki Weight": "14.60 cts",
      "Diamond Weight": "4.80 cts (VVS-VS, EF)",
      "Certification": "SGL Certified"
    }
  },
  {
    id: "dn00088",
    slug: "norah-diamond-necklace",
    name: "Norah Diamond Necklace",
    celeb: "Jiya Shankar",
    price: 367100,
    tag: "Made to Order",
    category: "Necklaces",
    isDiamond: true,
    images: [
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    ],
    description: "The Norah Diamond Necklace boasts a geometric layout of baguettes and round brilliant diamonds that flow like liquid light. An excellent choice for receptions, cocktail parties, and modern bridal coordinates.",
    specifications: {
      "Gold Purity": "18KT White Gold",
      "Gold Weight": "22.40 gms",
      "Diamond Weight": "6.85 cts",
      "Clarity & Color": "VVS-VS, GH Color",
      "Certification": "SGL Certified"
    }
  },
  {
    id: "dn00188",
    slug: "mayuri-diamond-necklace",
    name: "Mayuri Diamond Necklace",
    celeb: "Lakshya Lalwani",
    price: 1123120,
    tag: "Made to Order",
    category: "Necklaces",
    isDiamond: true,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Inspired by the grace of a peacock's plumage, the Mayuri Necklace combines marquise and pear cut diamonds in a cascading lace pattern. Every diamond is individually selected to ensure perfect matching of color and brilliance.",
    specifications: {
      "Gold Purity": "18KT Rose Gold",
      "Gold Weight": "52.30 gms",
      "Diamond Weight": "12.40 cts",
      "Clarity & Color": "VS-SI, G-H Color",
      "Certification": "SGL Certified"
    }
  },
  {
    id: "er00122",
    slug: "royal-polki-chandbalis",
    name: "Royal Polki Chandbalis",
    celeb: "Alia Bhatt",
    price: 520000,
    tag: "Ready to Ship",
    category: "Earrings",
    isPolki: true,
    isBridal: true,
    images: [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Timeless crescent-shaped earrings featuring layers of uncut syndicate diamonds, intricate gold-plated filigree, and cascading natural rubies and seed pearls. These chandbalis bring royal Mughal grandeur to any look.",
    specifications: {
      "Gold Purity": "22KT Hallmarked Gold",
      "Gold Weight": "34.10 gms",
      "Polki Weight": "8.30 cts",
      "Gemstones": "Natural ruby beads, pearls",
      "Certification": "SGL Certified"
    }
  },
  {
    id: "er00350",
    slug: "heritage-bridal-jhumkas",
    name: "Heritage Bridal Jhumkas",
    celeb: "Kriti Sanon",
    price: 380000,
    tag: "Made to Order",
    category: "Earrings",
    isPolki: true,
    isBridal: true,
    images: [
      "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Classic double-tiered jhumkas handcrafted in traditional Meenakari and Jadau style. Featuring raw Polki diamond studs and tiny hanging pearls, they have a magnificent bell-like swing and authentic ethnic character.",
    specifications: {
      "Gold Purity": "22KT Gold with enamel (Meenakari)",
      "Gold Weight": "24.50 gms",
      "Polki Weight": "5.10 cts",
      "Certification": "BIS Hallmarked"
    }
  },
  {
    id: "br00501",
    slug: "kundan-polki-kara-bracelets",
    name: "Kundan Polki Kara Bracelets",
    celeb: "Kiara Advani",
    price: 780000,
    tag: "Ready to Ship",
    category: "Bracelets",
    isPolki: true,
    isBridal: true,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=800&auto=format&fit=crop"
    ],
    description: "An exquisite pair of openable gold Karas, studded with large foil-backed uncut diamonds (Polki) and finished with detailed red and green enamel painting on the inner rim. A hallmark of heritage Rajasthani couture.",
    specifications: {
      "Gold Purity": "22KT Hallmarked Gold",
      "Gold Weight": "48.90 gms (Pair)",
      "Polki Weight": "12.80 cts",
      "Enamel": "Traditional Red-Green Kundan-Meena",
      "Certification": "SGL Certified"
    }
  },
  {
    id: "rg00912",
    slug: "classic-polki-cocktail-ring",
    name: "Classic Polki Cocktail Ring",
    celeb: "Janhvi Kapoor",
    price: 215000,
    tag: "Ready to Ship",
    category: "Rings",
    isPolki: true,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop"
    ],
    description: "An oversized statement cocktail ring. Centered on a massive uncut diamond, surrounded by a floral halo of rose-cut diamonds and pearls. The adjustable shank features detailed gold leaf carvings.",
    specifications: {
      "Gold Purity": "22KT Gold",
      "Gold Weight": "14.20 gms",
      "Polki Weight": "4.50 cts",
      "Certification": "BIS Hallmarked"
    }
  }
];

export const formatPrice = (num) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);

export const stores = [
  {
    city: "Jammu",
    state: "Jammu & Kashmir",
    address: "Channi Himat, Jammu, Jammu and Kashmir 180015",
    hours: "Mon–Sun 11:00 AM – 08:00 PM",
    phone: "+91 96193 87006",
    mapUrl: "https://maps.app.goo.gl/29RCKxmt3N4jemfo7",
    img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop",
  },
  {
    city: "Surat",
    state: "Gujarat",
    address: "Dasani Plaza, Opp. Sarela Shopping Center, Ghod Dod Rd, Surat 395001",
    hours: "Mon–Sun 11:00 AM – 08:00 PM",
    phone: "+91 96197 46253",
    mapUrl: "https://maps.app.goo.gl/ZEPTZU5Eik6UYchF6",
    img: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop",
  },
  {
    city: "Jalandhar",
    state: "Punjab",
    address: "Central Arc Building, New Jawahar Nagar, Jalandhar 144001",
    hours: "Mon–Sat 11:00 AM – 08:00 PM",
    phone: "+91 82915 00394",
    mapUrl: "https://maps.app.goo.gl/yTemNvCakW2bAzNaA",
    img: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=800&auto=format&fit=crop",
  },
  {
    city: "Bandra, Mumbai",
    state: "Maharashtra",
    address: "190 Turner Road, Bandra West, Mumbai 400050",
    hours: "Mon–Sat 11:00 AM – 06:00 PM",
    phone: "+91 84229 18035",
    mapUrl: "https://maps.app.goo.gl/9Sh8czjjbbee5DyV7",
    img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop",
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    address: "4, Woodburn Park Road, Elgin Rd, Kolkata 700020",
    hours: "Mon–Sun 11:00 AM – 08:00 PM",
    phone: "+91 84228 34581",
    mapUrl: "https://maps.app.goo.gl/",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop",
  },
  {
    city: "New Delhi",
    state: "Delhi",
    address: "M-Block Market, Greater Kailash 1, New Delhi 110048",
    hours: "Mon–Sun 11:00 AM – 08:00 PM",
    phone: "+91 98100 22345",
    mapUrl: "https://maps.app.goo.gl/",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
  },
  {
    city: "Jaipur",
    state: "Rajasthan",
    address: "C-Scheme, Near Central Park, Jaipur 302001",
    hours: "Mon–Sun 10:30 AM – 08:30 PM",
    phone: "+91 94140 55678",
    mapUrl: "https://maps.app.goo.gl/",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
  },
  {
    city: "Ahmedabad",
    state: "Gujarat",
    address: "SG Highway, Near Iscon Cross Road, Ahmedabad 380015",
    hours: "Mon–Sun 11:00 AM – 08:00 PM",
    phone: "+91 99988 76543",
    mapUrl: "https://maps.app.goo.gl/",
    img: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=800&auto=format&fit=crop",
  },
  {
    city: "Chandigarh",
    state: "Punjab",
    address: "SCO 45-46, Sector 17, Chandigarh 160017",
    hours: "Mon–Sat 11:00 AM – 08:00 PM",
    phone: "+91 90410 12378",
    mapUrl: "https://maps.app.goo.gl/",
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
  },
];

export const whatsappNumber = "919619587978";

export const testimonials = [
  {
    name: "Neha",
    location: "New Zealand",
    text: "The piece I purchased feels like a work of art. The shine, detailing, and authenticity are remarkable.",
    img: "https://images.unsplash.com/photo-1594744803329-92b0a3fca7a3?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Zarin",
    location: "Bangladesh",
    text: "The craftsmanship is exceptional, with intricate designs that truly elevate the overall look.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Priya Patel",
    location: "USA",
    text: "Custom designed my wedding jewellery — it turned out phenomenal. Easy to communicate with, on time delivery.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Nitya Tazrain",
    location: "Bangladesh",
    text: "An amazing experience. As an international client it met my expectations perfectly.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
  },
];

export const trustBadges = [
  { title: "Certified Jewellery", subtitle: "Authenticity you can trust" },
  { title: "Lifetime Buyback", subtitle: "Value assured, always" },
  { title: "Free Insured Shipping", subtitle: "Secure delivery, no extra cost" },
  { title: "12+ Stores across India", subtitle: "Experience Madhu near you" },
  { title: "Worldwide Shipping", subtitle: "Jewels delivered globally" },
  { title: "100,000+ Units Sold", subtitle: "Trusted by thousands" },
];

export const IMG = {
  heroBridal: "https://i.pinimg.com/736x/02/7c/63/027c63053b3aeb0110d9cd43007ca350.jpg",
  heroBridalMobile: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW24_xUv51-Vh3er9tPuZgQWgXfa8y8_nBECQOlcvgEA&s=10",
  catNecklace: "https://i.pinimg.com/vwebp/1200x/3b/62/a1/3b62a1d25021e8c773adbe14633aed0a.webp",
  catEarrings: "https://i.pinimg.com/1200x/85/42/67/85426729501ed4c42db1f582b023295a.jpg",
  catBracelet: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
  catAccessory: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
  catSets: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=600&auto=format&fit=crop",
  product: [
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=900&auto=format&fit=crop",
  ],
  store: [
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop",
  ],
  testimonial: [
    "https://images.unsplash.com/photo-1594744803329-92b0a3fca7a3?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
  ],
  uncutDiamond: "https://i.pinimg.com/736x/8f/36/30/8f36301407942819d6e354b7f8e5213d.jpg",
  bridalBanner: "https://i.pinimg.com/736x/ec/d8/ae/ecd8aeb189bd7042673dbd0333956710.jpg",
  brandStory: "https://i.pinimg.com/1200x/d5/a8/62/d5a862bee632bc8de853cd6277664031.jpg",
  handcraftedNecklace: "https://i.pinimg.com/vwebp/736x/43/5b/ae/435bae845ed8353bfbceeedfc58ea533.webp",
  handcraftedEarring: "https://i.pinimg.com/736x/db/15/0f/db150f268e171d7264fa2120dd4b2770.jpg",
  handcraftedMinimal: "https://i.pinimg.com/736x/f8/d0/87/f8d087929955a3fe822eafc5d004dbdc.jpg",
  insta: [
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=500&auto=format&fit=crop",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW24_xUv51-Vh3er9tPuZgQWgXfa8y8_nBECQOlcvgEA&s=10",
  ],
};
