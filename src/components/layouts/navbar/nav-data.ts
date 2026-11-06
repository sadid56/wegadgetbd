export interface NavChildItem {
  title: string;
  href: string;
  titleBn?: string;
}

export interface NavSubCategory {
  id: string;
  name: string;
  nameBn?: string;
  href: string;
  items: NavChildItem[];
}

export interface NavCategoryItem {
  id: string;
  name: string;
  nameBn: string;
  href: string;
  subCategories: NavSubCategory[];
}

export const NAV_CATEGORIES: NavCategoryItem[] = [
  // 1. SMART WEARABLES
  {
    id: "smart-wearables",
    name: "Smart Wearables",
    nameBn: "স্মার্ট ওয়্যারেবলস",
    href: "/products?category=smart-wearables",
    subCategories: [
      {
        id: "smartwatches",
        name: "Smartwatches",
        nameBn: "স্মার্টওয়াচ",
        href: "/products?search=smartwatch",
        items: [
          { title: "AMOLED Calling Watches", href: "/products?search=amoled+calling+watch" },
          { title: "Rugged Outdoor Watches", href: "/products?search=rugged+watch" },
          { title: "Ultra Slim Sports Watches", href: "/products?search=sports+watch" },
          { title: "Kids GPS Smartwatches", href: "/products?search=kids+gps+watch" },
          { title: "Luxury Metal Strap Watches", href: "/products?search=metal+watch" },
        ],
      },
      {
        id: "fitness-trackers",
        name: "Fitness Trackers",
        nameBn: "ফিটনেস ট্র্যাকার",
        href: "/products?search=fitness+tracker",
        items: [
          { title: "Heart Rate & SpO2 Bands", href: "/products?search=spo2+band" },
          { title: "Waterproof Sports Bands", href: "/products?search=waterproof+band" },
          { title: "Sleep & Stress Monitors", href: "/products?search=sleep+tracker" },
          { title: "Step & Activity Counters", href: "/products?search=activity+tracker" },
        ],
      },
      {
        id: "smart-rings-glasses",
        name: "Smart Rings & Glasses",
        nameBn: "স্মার্ট রিং ও গ্লাস",
        href: "/products?search=smart+ring",
        items: [
          { title: "Smart Health Rings", href: "/products?search=smart+ring" },
          { title: "Bluetooth Audio Sunglasses", href: "/products?search=audio+glasses" },
          { title: "Anti-Blue Light Smart Eyewear", href: "/products?search=smart+eyewear" },
        ],
      },
      {
        id: "watch-accessories",
        name: "Watch Accessories",
        nameBn: "ওয়াচ অ্যাক্সেসরিজ",
        href: "/products?search=watch+strap",
        items: [
          { title: "Magnetic & Silicone Straps", href: "/products?search=watch+strap" },
          { title: "Stainless Steel Mesh Bands", href: "/products?search=metal+mesh+strap" },
          { title: "Fast Magnetic Wireless Chargers", href: "/products?search=watch+charger" },
          { title: "Tempered Glass & Bumper Cases", href: "/products?search=watch+case" },
        ],
      },
    ],
  },

  // 2. AUDIO & SOUND
  {
    id: "audio",
    name: "Audio & Sound",
    nameBn: "অডিও ও সাউন্ড",
    href: "/products?category=audio",
    subCategories: [
      {
        id: "tws-earbuds",
        name: "TWS Earbuds",
        nameBn: "ওয়্যারলেস ইয়ারবাডস",
        href: "/products?search=tws+earbuds",
        items: [
          { title: "Active Noise Cancelling (ANC)", href: "/products?search=anc+earbuds" },
          { title: "Low Latency Gaming Earbuds", href: "/products?search=gaming+earbuds" },
          { title: "Transparent Cyberpunk TWS", href: "/products?search=transparent+earbuds" },
          { title: "Long Battery Standby TWS", href: "/products?search=long+battery+earbuds" },
        ],
      },
      {
        id: "headphones",
        name: "Headphones",
        nameBn: "হেডফোন",
        href: "/products?search=headphones",
        items: [
          { title: "Wireless Over-Ear Headphones", href: "/products?search=wireless+headphone" },
          { title: "Deep Bass Bluetooth Headsets", href: "/products?search=bass+headphone" },
          { title: "RGB 7.1 Gaming Headphones", href: "/products?search=gaming+headset" },
          { title: "Foldable Travel Headphones", href: "/products?search=foldable+headphone" },
        ],
      },
      {
        id: "bluetooth-speakers",
        name: "Bluetooth Speakers",
        nameBn: "ব্লুটুথ স্পিকার",
        href: "/products?search=bluetooth+speaker",
        items: [
          { title: "Portable Pocket Mini Speakers", href: "/products?search=mini+speaker" },
          { title: "Waterproof Outdoor Speakers", href: "/products?search=waterproof+speaker" },
          { title: "RGB Party Bass Speakers", href: "/products?search=rgb+speaker" },
          { title: "Retro Wooden Desktop Speakers", href: "/products?search=wooden+speaker" },
        ],
      },
      {
        id: "audio-accessories",
        name: "Mics & Audio Adapters",
        nameBn: "মাইক ও অডিও অ্যাডাপ্টার",
        href: "/products?search=audio+accessories",
        items: [
          { title: "Wireless Lapel Lavalier Mics", href: "/products?search=wireless+mic" },
          { title: "Type-C & Lightning Audio Jacks", href: "/products?search=audio+jack+adapter" },
          { title: "Desktop USB Podcast Mics", href: "/products?search=usb+mic" },
        ],
      },
    ],
  },

  // 3. SMART HOME & CARE
  {
    id: "smart-home",
    name: "Smart Home & Care",
    nameBn: "স্মার্ট হোম ও কেয়ার",
    href: "/products?category=smart-home",
    subCategories: [
      {
        id: "motion-sensor-lights",
        name: "Motion Sensor Lights",
        nameBn: "মোশন সেন্সর লাইট",
        href: "/products?search=sensor+light",
        items: [
          { title: "Magnetic Wardrobe Stick Lights", href: "/products?search=cabinet+light" },
          { title: "Rechargeable Night Lights", href: "/products?search=sensor+night+light" },
          { title: "Staircase Infrared Step Lights", href: "/products?search=stair+light" },
          { title: "Solar Outdoor Waterproof Lights", href: "/products?search=solar+sensor+light" },
        ],
      },
      {
        id: "ambient-lighting",
        name: "Ambient & Desk Lights",
        nameBn: "অ্যাম্বিয়েন্ট ও ডেস্ক লাইট",
        href: "/products?search=ambient+lighting",
        items: [
          { title: "RGB Screenbar Monitor Lights", href: "/products?search=monitor+light+bar" },
          { title: "Sunset Glow Projection Lamps", href: "/products?search=sunset+lamp" },
          { title: "Smart WiFi App LED Strips", href: "/products?search=rgb+strip" },
          { title: "Galaxy Star Projector Lights", href: "/products?search=galaxy+projector" },
        ],
      },
      {
        id: "cleaning-fabric-care",
        name: "Cleaning & Fabric Care",
        nameBn: "ক্লিনিং ও ফ্যাব্রিক কেয়ার",
        href: "/products?search=cleaning+gadgets",
        items: [
          { title: "Electric Rechargeable Lint Removers", href: "/products?search=lint+remover" },
          { title: "Ultrasonic Jewelry Cleaners", href: "/products?search=ultrasonic+cleaner" },
          { title: "Cordless Mini Desktop Vacuums", href: "/products?search=desk+vacuum" },
          { title: "20-in-1 Tech Cleaning Kits", href: "/products?search=cleaning+kit" },
        ],
      },
      {
        id: "air-home-comfort",
        name: "Air & Home Comfort",
        nameBn: "এয়ার ও হোম কমফোর্ট",
        href: "/products?search=home+comfort",
        items: [
          { title: "USB Flame Mist Humidifiers", href: "/products?search=flame+humidifier" },
          { title: "Aroma Essential Oil Diffusers", href: "/products?search=oil+diffuser" },
          { title: "Digital Thermo-Hygrometers", href: "/products?search=humidity+meter" },
          { title: "Smart WiFi Remote Plug Sockets", href: "/products?search=smart+plug" },
        ],
      },
    ],
  },

  // 4. CREATOR & MOBILE GEAR
  {
    id: "creator-gear",
    name: "Creator & Mobile Gear",
    nameBn: "ক্রিয়েটর ও মোবাইল গিয়ার",
    href: "/products?category=creator-gear",
    subCategories: [
      {
        id: "mobile-filming",
        name: "Filming & Mounts",
        nameBn: "ফিল্মিং ও ট্রাইপড",
        href: "/products?search=filming+gear",
        items: [
          { title: "3-Axis Smartphone Gimbals", href: "/products?search=phone+gimbal" },
          { title: "Extendable Bluetooth Selfie Tripods", href: "/products?search=selfie+tripod" },
          { title: "Overhead Desktop Video Arms", href: "/products?search=overhead+mount" },
          { title: "Auto Face-Tracking 360° Mounts", href: "/products?search=face+tracking+mount" },
        ],
      },
      {
        id: "creator-lighting",
        name: "Vlog & Video Lights",
        nameBn: "ভিডিও লাইটিং",
        href: "/products?search=video+light",
        items: [
          { title: "Pocket RGB Color Fill Lights", href: "/products?search=rgb+video+light" },
          { title: "12-Inch Bi-Color Ring Lights", href: "/products?search=ring+light" },
          { title: "Magnetic MagSafe Selfie Lights", href: "/products?search=magsafe+light" },
          { title: "Mini Clip-on Laptop Video Lights", href: "/products?search=laptop+light" },
        ],
      },
      {
        id: "creator-mics",
        name: "Wireless Microphones",
        nameBn: "ওয়্যারলেস মাইক",
        href: "/products?search=wireless+microphone",
        items: [
          { title: "Dual Clip-On Type-C Lapel Mics", href: "/products?search=dual+wireless+mic" },
          { title: "Lightning iPhone Wireless Mics", href: "/products?search=iphone+wireless+mic" },
          { title: "Noise Cancellation Lavalier Mics", href: "/products?search=noise+reduction+mic" },
          { title: "RGB Tap-To-Mute Desktop Mics", href: "/products?search=rgb+desktop+mic" },
        ],
      },
      {
        id: "mobile-gaming-gear",
        name: "Mobile Gaming Tools",
        nameBn: "মোবাইল গেমিং গ্যাজেট",
        href: "/products?search=mobile+gaming",
        items: [
          { title: "Magnetic Semiconductor Coolers", href: "/products?search=phone+cooler" },
          { title: "Physical 4-Finger Claw Triggers", href: "/products?search=gaming+triggers" },
          { title: "Conductive Carbon Fiber Sleeves", href: "/products?search=finger+sleeves" },
          { title: "Bluetooth Mobile Gamepad Controllers", href: "/products?search=mobile+gamepad" },
        ],
      },
    ],
  },

  // 5. TOOLS, POWER & EDC
  {
    id: "tools-diy",
    name: "Tools, Power & EDC",
    nameBn: "টুলস, পাওয়ার ও ইডিসি",
    href: "/products?category=tools-diy",
    subCategories: [
      {
        id: "power-charging",
        name: "Power Banks & Chargers",
        nameBn: "পাওয়ার ও ফাস্ট চার্জার",
        href: "/products?search=power+bank",
        items: [
          { title: "Mini Capsule Pocket Power Banks", href: "/products?search=capsule+power+bank" },
          { title: "GaN 65W / 100W Quick Chargers", href: "/products?search=gan+charger" },
          { title: "Magnetic Wireless MagSafe Banks", href: "/products?search=magsafe+power+bank" },
          { title: "3-in-1 Foldable Wireless Docks", href: "/products?search=3in1+wireless+charger" },
          { title: "100W Type-C Fast Data Cables", href: "/products?search=100w+cable" },
        ],
      },
      {
        id: "precision-tools",
        name: "Precision Screwdrivers",
        nameBn: "প্রিসিশন স্ক্রুড্রাইভার",
        href: "/products?search=precision+screwdriver",
        items: [
          { title: "64-in-1 Magnetic Repair Kits", href: "/products?search=64+in+1+screwdriver" },
          { title: "Cordless Electric Screwdrivers", href: "/products?search=electric+screwdriver" },
          { title: "Anti-Static Electronics Tweezers", href: "/products?search=repair+tweezers" },
          { title: "Magnetic Screw Organizer Mats", href: "/products?search=magnetic+screw+mat" },
        ],
      },
      {
        id: "turbo-blowers",
        name: "Turbo Fans & Dusters",
        nameBn: "টার্বো ব্লোয়ার ও ডাস্টার",
        href: "/products?search=turbo+blower",
        items: [
          { title: "130,000 RPM Turbo Jet Blowers", href: "/products?search=turbo+blower" },
          { title: "Cordless Compressed Air Dusters", href: "/products?search=electric+air+duster" },
          { title: "Anti-Static Camera Lens Brushes", href: "/products?search=lens+brush" },
          { title: "Keyboard & Screen Clean Gel", href: "/products?search=cleaning+gel" },
        ],
      },
      {
        id: "travel-edc",
        name: "Travel & EDC Tools",
        nameBn: "ট্রাভেল ও ইডিসি টুলস",
        href: "/products?search=edc+tools",
        items: [
          { title: "Portable Auto Tyre Inflators", href: "/products?search=electric+tyre+inflator" },
          { title: "15-in-1 EDC Pocket Multi-Tools", href: "/products?search=multi+tool+pliers" },
          { title: "Digital Laser Distance Meters", href: "/products?search=laser+distance+meter" },
          { title: "Universal All-in-One Travel Adapters", href: "/products?search=universal+travel+adapter" },
        ],
      },
    ],
  },
];
