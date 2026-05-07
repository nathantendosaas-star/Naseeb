export interface CarSpecs {
  engine?: string;
  hp?: number | string;
  torque?: string;
  acceleration?: string;
  topSpeed?: string;
  transmission?: string;
  driveType?: string;
  drivetrain?: string;
  fuelType?: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  hp: number;
  price: string;
  status: 'Available' | 'Sold' | 'In Transit';
  watermarkText: string;
  image: string;
  gallery: string[];
  specs?: CarSpecs;
  rotation?: number;
  description?: string;
  features?: string[];
}

export const cars: Car[] = [
  {
    id: 'rolls-royce-cullinan',
    make: 'Rolls-Royce',
    model: 'Cullinan Black Badge',
    year: 2026,
    hp: 600,
    price: '$480,000',
    status: 'Available',
    watermarkText: 'CULLINAN',
    image: '/assets/Rolls-Royce Cullinan Black Badge/main.jpg',
    gallery: [
      '/assets/Rolls-Royce Cullinan Black Badge/main.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_645644852_17885070462356166_1052982335959720841_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_655188402_18004693256887931_4057923087349680690_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_655208127_18064681094354925_1673883316772820077_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_655287871_18062018531359290_8109613184479440304_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_655319199_18089525977920299_4807178985847969559_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_655889409_18187695037322377_2071791926118733614_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_656472093_18117011239653240_4001970264619500023_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_661001431_18111836662771764_7659917181522331414_n.jpg'
    ],
    specs: {
      engine: '6.75L V12 Twin-Turbo',
      hp: 600,
      torque: '900 Nm',
      acceleration: '4.9 seconds',
      topSpeed: '250 km/h',
      transmission: '8-speed automatic',
      driveType: 'All-Wheel Drive (AWD)'
    }
  },
  {
    id: 'mercedes-sprinter',
    make: 'Mercedes-Benz',
    model: 'Sprinter Luxury Van',
    year: 2026,
    hp: 250,
    price: '$180,000',
    status: 'Available',
    watermarkText: 'SPRINTER',
    image: '/assets/Mercedes-Benz Sprinter/main.webp',
    gallery: [
      '/assets/Mercedes-Benz Sprinter/main.webp',
      '/assets/Mercedes-Benz Sprinter/Luxury-Sprinter-Van-1.jpg'
    ]
  },
  {
    id: 'gle-350d',
    make: 'Mercedes-Benz',
    model: 'GLE 350d 4MATIC',
    year: 2018,
    hp: 255,
    price: '$28,000',
    status: 'Available',
    watermarkText: 'GLE350D',
    image: '/assets/2018 Mercedes-Benz GLE 350d 4MATIC/main.jpg',
    gallery: [
      '/assets/2018 Mercedes-Benz GLE 350d 4MATIC/main.jpg',
      '/assets/2018 Mercedes-Benz GLE 350d 4MATIC/SaveClip.App_586669133_17929842048140792_6919276109600389216_n.jpg',
      '/assets/2018 Mercedes-Benz GLE 350d 4MATIC/SaveClip.App_587278268_17929842060140792_8169053905024284709_n.jpg',
      '/assets/2018 Mercedes-Benz GLE 350d 4MATIC/SaveClip.App_587289336_17929842015140792_1573921457145670117_n.jpg',
      '/assets/2018 Mercedes-Benz GLE 350d 4MATIC/SaveClip.App_587293382_17929842030140792_960887648718631311_n.jpg',
      '/assets/2018 Mercedes-Benz GLE 350d 4MATIC/SaveClip.App_587298143_17929842039140792_3992902034916051010_n.jpg'
    ],
    specs: {
      engine: '3.0L V6 Turbo Diesel',
      hp: 255,
      torque: '620 Nm',
      acceleration: '7.0 seconds',
      topSpeed: '225 km/h',
      transmission: '9G-TRONIC automatic',
      driveType: '4MATIC AWD'
    }
  },
  {
    id: 'bentley-gt',
    make: 'Bentley',
    model: 'Continental GT',
    year: 2026,
    hp: 650,
    price: '$300,000',
    status: 'Available',
    watermarkText: 'BENTLEY',
    image: '/assets/Bentley Continental GT/main.jpg',
    gallery: [
      '/assets/Bentley Continental GT/main.jpg',
      '/assets/Bentley Continental GT/pexels-nikita-volodko-1234519-29527991.jpg',
      '/assets/Bentley Continental GT/pexels-tima-miroshnichenko-6872163.jpg',
      '/assets/Bentley Continental GT/pexels-tima-miroshnichenko-6872600.jpg',
      '/assets/Bentley Continental GT/pexels-tima-miroshnichenko-6873074.jpg'
    ],
    specs: {
      engine: '6.0L W12 Twin-Turbo',
      hp: 650,
      torque: '900 Nm',
      acceleration: '3.6 seconds',
      topSpeed: '335 km/h',
      transmission: '8-speed dual-clutch',
      driveType: 'All-Wheel Drive (AWD)'
    }
  },
  {
    id: 'bmw-7-series',
    make: 'BMW',
    model: '7 Series',
    year: 2026,
    hp: 445,
    price: '$110,000',
    status: 'Available',
    watermarkText: 'BMW7',
    image: '/assets/BMW 7 Series/main.jpg',
    gallery: [
      '/assets/BMW 7 Series/main.jpg',
      '/assets/BMW 7 Series/SaveClip.App_482475277_610615665287399_8107601930896040158_n.jpg',
      '/assets/BMW 7 Series/SaveClip.App_653853820_18048902738708314_1714450360385024689_n.jpg',
      '/assets/BMW 7 Series/SaveClip.App_655439246_18041629985538694_2443531512184741997_n.jpg',
      '/assets/BMW 7 Series/SaveClip.App_656630372_18049291448720709_155919968737098602_n.jpg',
      '/assets/BMW 7 Series/SaveClip.App_659153693_18110698015700618_7216686868984854506_n.jpg'
    ],
    specs: {
      engine: '3.0L Inline-6 Turbo with Mild Hybrid',
      hp: 375,
      torque: '520 Nm',
      acceleration: '5.2 seconds',
      topSpeed: '250 km/h',
      transmission: '8-speed automatic',
      driveType: 'Rear-Wheel Drive / xDrive'
    }
  },
  {
    id: 'bmw-7-mansory',
    make: 'BMW',
    model: '7 Series Mansory',
    year: 2026,
    hp: 550,
    price: '$220,000',
    status: 'Available',
    watermarkText: 'MANSORY',
    image: '/assets/BMW 7 Series-Mansory/main.jpg',
    gallery: [
      '/assets/BMW 7 Series-Mansory/main.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_472039352_918010490546729_7765610575373542732_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_639827816_17917883241283578_3682488524676178915_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_650302713_17923348851258760_2473498152113349915_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_654453510_17918976189122563_896535207331512895_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_655285052_18080969849575795_6951236676705556886_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_655758860_18058585826433762_6612121157402348636_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_656291207_18108689239647030_8848212656608406533_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_657516507_18130779376558040_1340103516831011220_n.jpg'
    ],
    specs: {
      engine: '4.4L V8 Twin-Turbo (Modified)',
      hp: 550,
      torque: '750 Nm',
      acceleration: '4.2 seconds',
      topSpeed: '280 km/h',
      transmission: '8-speed automatic',
      driveType: 'xDrive All-Wheel Drive'
    }
  },
  {
    id: 'range-rover-vogue',
    make: 'Land Rover',
    model: 'Range Rover Vogue',
    year: 2026,
    hp: 523,
    price: '$160,000',
    status: 'Available',
    watermarkText: 'VOGUE',
    image: '/assets/Land Rover Range Rover Vogue/main.jpg',
    gallery: [
      '/assets/Land Rover Range Rover Vogue/main.jpg',
      '/assets/Land Rover Range Rover Vogue/SaveClip.App_491442984_17907033633140792_8107841793494064125_n.jpg',
      '/assets/Land Rover Range Rover Vogue/SaveClip.App_496818511_17907033582140792_6362885496785652749_n.jpg',
      '/assets/Land Rover Range Rover Vogue/SaveClip.App_496820982_17907033594140792_1710835746530368193_n.jpg',
      '/assets/Land Rover Range Rover Vogue/SaveClip.App_496858304_17907033591140792_1560336693309611344_n.jpg',
      '/assets/Land Rover Range Rover Vogue/SaveClip.App_496875863_17907033621140792_4456812056696596572_n.jpg',
      '/assets/Land Rover Range Rover Vogue/SaveClip.App_496972499_17907033642140792_6554810886375745438_n.jpg',
      '/assets/Land Rover Range Rover Vogue/SaveClip.App_497140816_17907033537140792_2838487044509364730_n.jpg',
      '/assets/Land Rover Range Rover Vogue/SaveClip.App_497346445_17907033573140792_1176180973244731001_n.jpg',
      '/assets/Land Rover Range Rover Vogue/SaveClip.App_497360309_17907033552140792_4802073241335724456_n.jpg',
      '/assets/Land Rover Range Rover Vogue/SaveClip.App_497435056_17907033618140792_7328958839384271031_n.jpg',
      '/assets/Land Rover Range Rover Vogue/SaveClip.App_497794670_17907033603140792_5827358164615246841_n.jpg'
    ],
    specs: {
      engine: '4.4L V8 Twin-Turbo (P530)',
      hp: 523,
      torque: '750 Nm',
      acceleration: '4.6 seconds',
      topSpeed: '250 km/h',
      transmission: '8-speed automatic',
      driveType: 'All-Wheel Drive (AWD)'
    }
  },
  {
    id: 'gle-63-amg',
    make: 'Mercedes-AMG',
    model: 'GLE 63 S',
    year: 2026,
    hp: 603,
    price: '$132,000',
    status: 'Available',
    watermarkText: 'AMG',
    image: '/assets/Mercedes-AMG GLE 63 S/main.jpg',
    gallery: [
      '/assets/Mercedes-AMG GLE 63 S/main.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_490224008_17904264666140792_4356500675914956193_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491146736_17904264675140792_2741043487482383629_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491416996_17904264672140792_7565325808664484308_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491418023_17904264669140792_2497390604793510537_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491438453_17904264663140792_7619951099074002206_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491440864_17904264621140792_8599087058250415650_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491441172_17904264612140792_1043117817945853448_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491442970_17904264684140792_5747297055056150950_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491445546_17904264654140792_7395186945875357450_n.jpg'
    ],
    specs: {
      engine: '4.0L V8 Biturbo with EQ Boost',
      hp: 603,
      torque: '850 Nm',
      acceleration: '3.8 seconds',
      topSpeed: '280 km/h',
      transmission: '9G-TRONIC automatic',
      driveType: '4MATIC+ All-Wheel Drive'
    }
  },
  {
    id: 'mercedes-g-class',
    make: 'Mercedes-Benz',
    model: 'G-Class',
    year: 2026,
    hp: 577,
    price: '$190,000',
    status: 'Available',
    watermarkText: 'G-CLASS',
    image: '/assets/Mercedes-Benz G-Class/main.jpg',
    gallery: [
      '/assets/Mercedes-Benz G-Class/main.jpg',
      '/assets/Mercedes-Benz G-Class/SaveClip.App_461101510_903593615009908_7474727303419448655_n.jpg',
      '/assets/Mercedes-Benz G-Class/SaveClip.App_649241404_17893737930288558_8034514004760461336_n.jpg',
      '/assets/Mercedes-Benz G-Class/SaveClip.App_655574848_18096905885297677_4421382158870647222_n.jpg',
      '/assets/Mercedes-Benz G-Class/SaveClip.App_656255807_18204969859331075_384029624559931374_n.jpg',
      '/assets/Mercedes-Benz G-Class/SaveClip.App_656266518_18089278423932129_1464736481894388292_n.jpg',
      '/assets/Mercedes-Benz G-Class/SaveClip.App_659777525_18118360048637458_9073244759963119633_n.jpg'
    ],
    specs: {
      engine: '4.0L V8 Biturbo (G 63)',
      hp: 577,
      torque: '850 Nm',
      acceleration: '4.5 seconds',
      topSpeed: '220 km/h',
      transmission: '9G-TRONIC automatic',
      driveType: 'Permanent 4WD'
    }
  },
  {
    id: 'mercedes-gle',
    make: 'Mercedes-Benz',
    model: 'GLE-Class',
    year: 2026,
    hp: 429,
    price: '$75,000',
    status: 'Available',
    watermarkText: 'GLE',
    image: '/assets/Mercedes-Benz GLE-Class/main.jpg',
    gallery: [
      '/assets/Mercedes-Benz GLE-Class/main.jpg',
      '/assets/Mercedes-Benz GLE-Class/SaveClip.App_586669196_17929842186140792_4594363106052402487_n.jpg',
      '/assets/Mercedes-Benz GLE-Class/SaveClip.App_587269222_17929842195140792_7955917783270247023_n.jpg',
      '/assets/Mercedes-Benz GLE-Class/SaveClip.App_587284126_17929842213140792_7174517549680686246_n.jpg',
      '/assets/Mercedes-Benz GLE-Class/SaveClip.App_587793374_17929842222140792_9050985822598342139_n.jpg',
      '/assets/Mercedes-Benz GLE-Class/SaveClip.App_588629604_17929842204140792_7132805616757135251_n.jpg',
      '/assets/Mercedes-Benz GLE-Class/SaveClip.App_589242079_17929842177140792_6800307861942290969_n.jpg'
    ],
    specs: {
      engine: '3.0L Inline-6 Turbo with Mild Hybrid (GLE 450)',
      hp: 375,
      torque: '500 Nm',
      acceleration: '5.3 seconds',
      topSpeed: '210 km/h',
      transmission: '9G-TRONIC automatic',
      driveType: '4MATIC AWD'
    }
  },
  {
    id: 'nissan-fuga',
    make: 'Nissan',
    model: 'Fuga',
    year: 2026,
    hp: 328,
    price: '$25,000',
    status: 'Available',
    watermarkText: 'FUGA',
    image: '/assets/Nissan Fuga/main.jpg',
    gallery: [
      '/assets/Nissan Fuga/main.jpg',
      '/assets/Nissan Fuga/SaveClip.App_581357439_17928295095140792_5926582982365786262_n.jpg',
      '/assets/Nissan Fuga/SaveClip.App_581519482_17928295080140792_2455856967220625991_n.jpg',
      '/assets/Nissan Fuga/SaveClip.App_581542314_17928295068140792_1239144523338660405_n.jpg',
      '/assets/Nissan Fuga/SaveClip.App_581670073_17928295104140792_3355989821446484300_n.jpg',
      '/assets/Nissan Fuga/SaveClip.App_583043794_17928295059140792_5972436677055488878_n.jpg'
    ],
    specs: {
      engine: '3.7L V6 (VQ37VHR)',
      hp: 328,
      torque: '363 Nm',
      acceleration: '6.0 seconds',
      topSpeed: '250 km/h',
      transmission: '7-speed automatic',
      driveType: 'Rear-Wheel Drive (RWD)'
    }
  },
  {
    id: 'toyota-lc300',
    make: 'Toyota',
    model: 'Land Cruiser 300 series',
    year: 2026,
    hp: 409,
    price: '$85,000',
    status: 'Available',
    watermarkText: 'LC300',
    image: '/assets/Toyota Land Cruiser 300 series/main.jpg',
    gallery: [
      '/assets/Toyota Land Cruiser 300 series/main.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_471836165_916065390591387_6726392414416639049_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_649361166_17915190600331471_7932701867398656143_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_650901366_17929995003215754_5890749422693484616_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_654014374_17962685822908016_2936458457199595394_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_654977314_18069392093283280_6258036108173864115_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_655070224_18137062567517235_9201078487715162691_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_655129047_18100362938482401_8536051254857003144_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_655515126_18069571766281635_8388522495990861785_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_656267092_18101303417299949_3052101019579294200_n.jpg'
    ],
    specs: {
      engine: '3.5L V6 Twin-Turbo',
      hp: 409,
      torque: '650 Nm',
      acceleration: '6.7 seconds',
      topSpeed: '210 km/h',
      transmission: '10-speed automatic',
      driveType: 'Full-Time 4WD'
    }
  },
  {
    id: 'mercedes-e-class',
    make: 'Mercedes-Benz',
    model: 'E-Class sedan',
    year: 2024,
    hp: 375,
    price: '$65,000',
    status: 'In Transit',
    watermarkText: 'E-CLASS',
    image: '/assets/Mercedes-Benz/TikVideo.App_7622475838721625352_2.jpeg',
    gallery: [
      '/assets/Mercedes-Benz/TikVideo.App_7622475838721625352_2.jpeg',
      '/assets/Mercedes-Benz/TikVideo.App_7622475838721625352_3.jpeg',
      '/assets/Mercedes-Benz/TikVideo.App_7622475838721625352_4.jpeg',
      '/assets/Mercedes-Benz/TikVideo.App_7622475838721625352_6.jpeg'
    ],
    rotation: -90,
    specs: {
      engine: '3.0L Inline-6 Turbo with Mild Hybrid (E 450)',
      hp: 375,
      torque: '500 Nm',
      acceleration: '4.5 seconds',
      topSpeed: '210 km/h (Limited)',
      transmission: '9G-TRONIC 9-speed automatic',
      driveType: '4MATIC All-Wheel Drive'
    }
  },
  {
    id: 'mercedes-ml350',
    make: 'Mercedes-Benz',
    model: 'ML 350 BlueTEC 4Matic',
    year: 2015,
    hp: 240,
    price: '$12,000',
    status: 'Available',
    watermarkText: 'ML350',
    image: '/assets/Mercedes-Benz/Mercedes-Benz ML 350 BlueTEC 4Matic/main.jpeg',
    gallery: [
      '/assets/Mercedes-Benz/Mercedes-Benz ML 350 BlueTEC 4Matic/main.jpeg',
      '/assets/Mercedes-Benz/Mercedes-Benz ML 350 BlueTEC 4Matic/TikVideo.App_7631952407940959496_2.jpeg',
      '/assets/Mercedes-Benz/Mercedes-Benz ML 350 BlueTEC 4Matic/TikVideo.App_7631952407940959496_3.jpeg',
      '/assets/Mercedes-Benz/Mercedes-Benz ML 350 BlueTEC 4Matic/TikVideo.App_7631952407940959496_5.jpeg',
      '/assets/Mercedes-Benz/Mercedes-Benz ML 350 BlueTEC 4Matic/TikVideo.App_7631952407940959496_6.jpeg',
      '/assets/Mercedes-Benz/Mercedes-Benz ML 350 BlueTEC 4Matic/TikVideo.App_7631952407940959496_8.jpeg'
    ],
    specs: {
      engine: '3.0L V6 Turbo Diesel',
      hp: 240,
      torque: '617 Nm',
      acceleration: '7.4 seconds',
      topSpeed: '224 km/h',
      transmission: '7G-TRONIC PLUS 7-speed automatic',
      driveType: '4MATIC All-Wheel Drive'
    }
  },
  {
    id: 'mercedes-glc',
    make: 'Mercedes-Benz',
    model: 'GLC',
    year: 2024,
    hp: 255,
    price: '$52,000',
    status: 'Available',
    watermarkText: 'GLC',
    image: '/assets/Mercedes-Benz/Mercedes-Benz-GLC/main.jpeg',
    gallery: [
      '/assets/Mercedes-Benz/Mercedes-Benz-GLC/main.jpeg',
      '/assets/Mercedes-Benz/Mercedes-Benz-GLC/TikVideo.App_7627223774756195604_2.jpeg',
      '/assets/Mercedes-Benz/Mercedes-Benz-GLC/TikVideo.App_7627223774756195604_4.jpeg',
      '/assets/Mercedes-Benz/Mercedes-Benz-GLC/TikVideo.App_7627223774756195604_6.jpeg',
      '/assets/Mercedes-Benz/Mercedes-Benz-GLC/TikVideo.App_7627223774756195604_8.jpeg',
      '/assets/Mercedes-Benz/Mercedes-Benz-GLC/TikVideo.App_7627223774756195604_9.jpeg'
    ],
    specs: {
      engine: '2.0L Inline-4 Turbo with Mild Hybrid (GLC 300)',
      hp: 255,
      torque: '400 Nm',
      acceleration: '6.2 seconds',
      topSpeed: '210 km/h',
      transmission: '9G-TRONIC 9-speed automatic',
      driveType: '4MATIC All-Wheel Drive'
    }
  },
  {
    id: 'ford-raptor-r',
    make: 'Ford',
    model: 'Raptor R',
    year: 2024,
    hp: 720,
    price: '$113,000',
    status: 'Available',
    watermarkText: 'RAPTOR-R',
    image: '/assets/FORD-RAPTOPR-R/main.jpg',
    gallery: [
      '/assets/FORD-RAPTOPR-R/main.jpg',
      '/assets/FORD-RAPTOPR-R/pexels-chaiya-saleethong-497043682-16033912.jpg',
      '/assets/FORD-RAPTOPR-R/pexels-garret-shields-1929773013-29043803.jpg',
      '/assets/FORD-RAPTOPR-R/pexels-redyar-rzgar-1257188192-31905071.jpg'
    ],
    specs: {
      engine: '5.2L Supercharged V8',
      hp: 720,
      torque: '868 Nm',
      acceleration: '3.7 seconds',
      topSpeed: '180 km/h (Limited)',
      transmission: '10-speed automatic',
      driveType: '4WD with Terrain Management'
    }
  },
  {
    id: 'mazda-cx5-2017',
    make: 'Mazda',
    model: 'CX-5',
    year: 2017,
    hp: 187,
    price: '$17,000',
    status: 'Available',
    watermarkText: 'CX-5',
    image: '/assets/2017 Mazda CX-5/main.jpeg',
    gallery: [
      '/assets/2017 Mazda CX-5/main.jpeg',
      '/assets/2017 Mazda CX-5/TikVideo.App_7622303994978815240_1.jpeg',
      '/assets/2017 Mazda CX-5/TikVideo.App_7622303994978815240_2.jpeg',
      '/assets/2017 Mazda CX-5/TikVideo.App_7622303994978815240_3.jpeg'
    ],
    specs: {
      engine: '2.5L SKYACTIV-G 4-cylinder',
      hp: 187,
      torque: '251 Nm',
      acceleration: '8.0 seconds',
      topSpeed: '195 km/h',
      transmission: '6-speed automatic',
      driveType: 'All-Wheel Drive (AWD)'
    }
  },
  {
    id: 'lexus-is250',
    make: 'Lexus',
    model: 'IS250',
    year: 2015,
    hp: 204,
    price: '$16,000',
    status: 'Available',
    watermarkText: 'IS250',
    image: '/assets/Lexus/main.jpg',
    gallery: [
      '/assets/Lexus/main.jpg',
      '/assets/Lexus/TikVideo.App_7628399067437239573_2.jpeg'
    ],
    specs: {
      engine: '2.5L V6 (4GR-FSE)',
      hp: 204,
      torque: '252 Nm',
      acceleration: '8.1 seconds',
      topSpeed: '225 km/h',
      transmission: '6-speed automatic',
      driveType: 'Rear-Wheel Drive (RWD)'
    }
  },
  {
    id: 'lexus-lx570',
    make: 'Lexus',
    model: 'LX 570',
    year: 2021,
    hp: 383,
    price: '$75,000',
    status: 'Available',
    watermarkText: 'LX570',
    image: '/assets/Lexus/Lexus LX 570/main.jpeg',
    gallery: [
      '/assets/Lexus/Lexus LX 570/main.jpeg',
      '/assets/Lexus/Lexus LX 570/TikVideo.App_7629123008992464148_2.jpeg',
      '/assets/Lexus/Lexus LX 570/TikVideo.App_7629123008992464148_3.jpeg',
      '/assets/Lexus/Lexus LX 570/TikVideo.App_7629123008992464148_4.jpeg'
    ],
    specs: {
      engine: '5.7L V8 (3UR-FE)',
      hp: 383,
      torque: '546 Nm',
      acceleration: '7.3 seconds',
      topSpeed: '220 km/h',
      transmission: '8-speed automatic',
      driveType: 'Full-time Four-Wheel Drive (4WD)'
    }
  },
  {
    id: 'porsche-cayenne-2013',
    make: 'Porsche',
    model: 'Cayenne',
    year: 2013,
    hp: 300,
    price: '$15,000',
    status: 'Available',
    watermarkText: 'CAYENNE',
    image: '/assets/Porsche/main.jpeg',
    gallery: [
      '/assets/Porsche/main.jpeg',
      '/assets/Porsche/TikVideo.App_7620782752723438866_1.jpeg',
      '/assets/Porsche/TikVideo.App_7620782752723438866_2.jpeg',
      '/assets/Porsche/TikVideo.App_7620782752723438866_3.jpeg'
    ],
    specs: {
      engine: '3.6L V6 (Base)',
      hp: 300,
      torque: '400 Nm',
      acceleration: '7.5 seconds',
      topSpeed: '230 km/h',
      transmission: '8-speed Tiptronic S',
      driveType: 'All-Wheel Drive (AWD)'
    }
  },
  {
    id: 'porsche-panamera',
    make: 'Porsche',
    model: 'Panamera',
    year: 2024,
    hp: 348,
    price: '$103,000',
    status: 'Available',
    watermarkText: 'PANAMERA',
    image: '/assets/Porsche/Porsche Panamera/main.jpeg',
    gallery: [
      '/assets/Porsche/Porsche Panamera/main.jpeg',
      '/assets/Porsche/Porsche Panamera/TikVideo.App_7623007832279125256_2.jpeg',
      '/assets/Porsche/Porsche Panamera/TikVideo.App_7623007832279125256_3.jpeg',
      '/assets/Porsche/Porsche Panamera/TikVideo.App_7623007832279125256_5.jpeg'
    ],
    specs: {
      engine: '2.9L V6 Twin-Turbo (Base)',
      hp: 348,
      torque: '500 Nm',
      acceleration: '5.1 seconds',
      topSpeed: '272 km/h',
      transmission: '8-speed PDK',
      driveType: 'Rear-Wheel Drive (RWD)'
    }
  },
  {
    id: 'subaru-forester',
    make: 'Subaru',
    model: 'Forester',
    year: 2024,
    hp: 180,
    price: '$32,000',
    status: 'Available',
    watermarkText: 'FORESTER',
    image: '/assets/Subaru Forester/main.jpeg',
    gallery: [
      '/assets/Subaru Forester/main.jpeg',
      '/assets/Subaru Forester/TikVideo.App_7630244670198566165_2.jpeg',
      '/assets/Subaru Forester/TikVideo.App_7630244670198566165_3.jpeg',
      '/assets/Subaru Forester/TikVideo.App_7630244670198566165_4.jpeg',
      '/assets/Subaru Forester/TikVideo.App_7630244670198566165_5.jpeg',
      '/assets/Subaru Forester/TikVideo.App_7630244670198566165_6.jpeg'
    ],
    specs: {
      engine: '2.5L 4-Cylinder SUBARU BOXER',
      hp: 180,
      torque: '241 Nm',
      acceleration: '9.4 seconds',
      topSpeed: '190 km/h',
      transmission: 'Lineartronic CVT',
      driveType: 'Symmetrical All-Wheel Drive (AWD)'
    }
  },
  {
    id: 'toyota-harrier',
    make: 'Toyota',
    model: 'Harrier',
    year: 2024,
    hp: 222,
    price: '$38,000',
    status: 'Available',
    watermarkText: 'HARRIER',
    image: '/assets/Toyota Harrier/main.jpeg',
    gallery: [
      '/assets/Toyota Harrier/main.jpeg',
      '/assets/Toyota Harrier/TikVideo.App_7624299119695105288_2.jpeg',
      '/assets/Toyota Harrier/TikVideo.App_7624299119695105288_4.jpeg',
      '/assets/Toyota Harrier/TikVideo.App_7624299119695105288_5.jpeg',
      '/assets/Toyota Harrier/TikVideo.App_7624299119695105288_6.jpeg',
      '/assets/Toyota Harrier/TikVideo.App_7624299119695105288_7.jpeg'
    ],
    specs: {
      engine: '2.5L Hybrid Crossover',
      hp: '222 hp (Combined)',
      torque: '221 Nm (Engine Only)',
      acceleration: '8.1 seconds',
      topSpeed: '180 km/h',
      transmission: 'e-CVT',
      driveType: 'E-Four All-Wheel Drive (AWD)'
    }
  },
  {
    id: 'toyota-prado',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    year: 2024,
    hp: 326,
    price: '$65,000',
    status: 'In Transit',
    watermarkText: 'PRADO',
    image: '/assets/Toyota Land Cruiser Prado/main.jpeg',
    gallery: [
      '/assets/Toyota Land Cruiser Prado/main.jpeg',
      '/assets/Toyota Land Cruiser Prado/TikVideo.App_7630244151736487189_2.jpeg',
      '/assets/Toyota Land Cruiser Prado/TikVideo.App_7630244151736487189_3.jpeg',
      '/assets/Toyota Land Cruiser Prado/TikVideo.App_7630244151736487189_4.jpeg',
      '/assets/Toyota Land Cruiser Prado/TikVideo.App_7630244151736487189_5.jpeg',
      '/assets/Toyota Land Cruiser Prado/TikVideo.App_7630244151736487189_6.jpeg'
    ],
    specs: {
      engine: '2.4L Turbo Hybrid (i-FORCE MAX)',
      hp: 326,
      torque: '630 Nm',
      acceleration: '8.0 seconds',
      topSpeed: '185 km/h',
      transmission: '8-speed automatic',
      driveType: 'Full-Time 4WD'
    }
  },
  {
    id: 'toyota-vellfire',
    make: 'Toyota',
    model: 'Vellfire',
    year: 2024,
    hp: 275,
    price: '$95,000',
    status: 'Available',
    watermarkText: 'VELLFIRE',
    image: '/assets/Toyota Vellfire/main.jpg',
    gallery: [
      '/assets/Toyota Vellfire/main.jpg',
      '/assets/Toyota Vellfire/TikVideo.App_7629762113262685461_2.jpeg',
      '/assets/Toyota Vellfire/TikVideo.App_7629762113262685461_3.jpeg',
      '/assets/Toyota Vellfire/TikVideo.App_7629762113262685461_4.jpeg',
      '/assets/Toyota Vellfire/SaveClip.App_663046153_18436268410188070_1889505112888851811_n.jpg'
    ],
    specs: {
      engine: '2.4L Turbocharged Petrol',
      hp: 275,
      torque: '430 Nm',
      acceleration: '8.5 seconds',
      topSpeed: '180 km/h',
      transmission: '8-speed automatic',
      driveType: 'All-Wheel Drive (AWD)'
    }
  }
];
