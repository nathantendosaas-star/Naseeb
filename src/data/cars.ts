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
}

export const cars: Car[] = [
  {
    id: 'rolls-royce-cullinan',
    make: 'Rolls-Royce',
    model: 'Cullinan Black Badge',
    year: 2026,
    hp: 600,
    price: '$450,000',
    status: 'Available',
    watermarkText: 'CULLINAN',
    image: '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_645644852_17885070462356166_1052982335959720841_n.jpg',
    gallery: [
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_645644852_17885070462356166_1052982335959720841_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_653674470_18026092805804079_2548394611182542092_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_655188402_18004693256887931_4057923087349680690_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_655208127_18064681094354925_1673883316772820077_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_655287871_18062018531359290_8109613184479440304_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_655319199_18089525977920299_4807178985847969559_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_655889409_18187695037322377_2071791926118733614_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_656472093_18117011239653240_4001970264619500023_n.jpg',
      '/assets/Rolls-Royce Cullinan Black Badge/SaveClip.App_661001431_18111836662771764_7659917181522331414_n.jpg'
    ]
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
    image: '/assets/Mercedes-Benz Sprinter/Luxury-Sprinter-Van-1.jpg',
    gallery: [
      '/assets/Mercedes-Benz Sprinter/Luxury-Sprinter-Van-1.jpg',
      '/assets/Mercedes-Benz Sprinter/m1.webp'
    ]
  },
  {
    id: 'gle-350d',
    make: 'Mercedes-Benz',
    model: 'GLE 350d 4MATIC',
    year: 2018,
    hp: 255,
    price: '$75,000',
    status: 'Available',
    watermarkText: 'GLE350D',
    image: '/assets/2018 Mercedes-Benz GLE 350d 4MATIC/main.jpg',
    gallery: [
      '/assets/2018 Mercedes-Benz GLE 350d 4MATIC/SaveClip.App_586669133_17929842048140792_6919276109600389216_n.jpg',
      '/assets/2018 Mercedes-Benz GLE 350d 4MATIC/SaveClip.App_587278268_17929842060140792_8169053905024284709_n.jpg',
      '/assets/2018 Mercedes-Benz GLE 350d 4MATIC/SaveClip.App_587289336_17929842015140792_1573921457145670117_n.jpg',
      '/assets/2018 Mercedes-Benz GLE 350d 4MATIC/SaveClip.App_587293382_17929842030140792_960887648718631311_n.jpg',
      '/assets/2018 Mercedes-Benz GLE 350d 4MATIC/SaveClip.App_587298143_17929842039140792_3992902034916051010_n.jpg'
    ]
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
      '/assets/Bentley Continental GT/pexels-nikita-volodko-1234519-29527991.jpg',
      '/assets/Bentley Continental GT/pexels-tima-miroshnichenko-6872163.jpg',
      '/assets/Bentley Continental GT/pexels-tima-miroshnichenko-6872600.jpg',
      '/assets/Bentley Continental GT/pexels-tima-miroshnichenko-6873074.jpg'
    ]
  },
  {
    id: 'bmw-7-series',
    make: 'BMW',
    model: '7 Series',
    year: 2026,
    hp: 445,
    price: '$120,000',
    status: 'Available',
    watermarkText: 'BMW7',
    image: '/assets/BMW 7 Series/main.jpg',
    gallery: [
      '/assets/BMW 7 Series/SaveClip.App_482475277_610615665287399_8107601930896040158_n.jpg',
      '/assets/BMW 7 Series/SaveClip.App_653853820_18048902738708314_1714450360385024689_n.jpg',
      '/assets/BMW 7 Series/SaveClip.App_655439246_18041629985538694_2443531512184741997_n.jpg',
      '/assets/BMW 7 Series/SaveClip.App_656630372_18049291448720709_155919968737098602_n.jpg',
      '/assets/BMW 7 Series/SaveClip.App_659153693_18110698015700618_7216686868984854506_n.jpg'
    ]
  },
  {
    id: 'bmw-7-mansory',
    make: 'BMW',
    model: '7 Series Mansory',
    year: 2026,
    hp: 550,
    price: '$160,000',
    status: 'Available',
    watermarkText: 'MANSORY',
    image: '/assets/BMW 7 Series-Mansory/main.jpg',
    gallery: [
      '/assets/BMW 7 Series-Mansory/SaveClip.App_472039352_918010490546729_7765610575373542732_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_639827816_17917883241283578_3682488524676178915_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_650302713_17923348851258760_2473498152113349915_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_654453510_17918976189122563_896535207331512895_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_655285052_18080969849575795_6951236676705556886_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_655758860_18058585826433762_6612121157402348636_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_656291207_18108689239647030_8848212656608406533_n.jpg',
      '/assets/BMW 7 Series-Mansory/SaveClip.App_657516507_18130779376558040_1340103516831011220_n.jpg'
    ]
  },
  {
    id: 'range-rover-vogue',
    make: 'Land Rover',
    model: 'Range Rover Vogue',
    year: 2026,
    hp: 523,
    price: '$200,000',
    status: 'Available',
    watermarkText: 'VOGUE',
    image: '/assets/Land Rover Range Rover Vogue/SaveClip.App_491442984_17907033633140792_8107841793494064125_n.jpg',
    gallery: [
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
    ]
  },
  {
    id: 'gle-63-amg',
    make: 'Mercedes-AMG',
    model: 'GLE 63 S',
    year: 2026,
    hp: 603,
    price: '$230,000',
    status: 'Available',
    watermarkText: 'AMG',
    image: '/assets/Mercedes-AMG GLE 63 S/main.jpg',
    gallery: [
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_490224008_17904264666140792_4356500675914956193_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491146736_17904264675140792_2741043487482383629_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491416996_17904264672140792_7565325808664484308_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491418023_17904264669140792_2497390604793510537_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491438453_17904264663140792_7619951099074002206_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491440864_17904264621140792_8599087058250415650_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491441172_17904264612140792_1043117817945853448_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491442970_17904264684140792_5747297055056150950_n.jpg',
      '/assets/Mercedes-AMG GLE 63 S/SaveClip.App_491445546_17904264654140792_7395186945875357450_n.jpg'
    ]
  },
  {
    id: 'mercedes-g-class',
    make: 'Mercedes-Benz',
    model: 'G-Class',
    year: 2026,
    hp: 577,
    price: '$210,000',
    status: 'Available',
    watermarkText: 'G-CLASS',
    image: '/assets/Mercedes-Benz G-Class/main.jpg',
    gallery: [
      '/assets/Mercedes-Benz G-Class/SaveClip.App_461101510_903593615009908_7474727303419448655_n.jpg',
      '/assets/Mercedes-Benz G-Class/SaveClip.App_649241404_17893737930288558_8034514004760461336_n.jpg',
      '/assets/Mercedes-Benz G-Class/SaveClip.App_655574848_18096905885297677_4421382158870647222_n.jpg',
      '/assets/Mercedes-Benz G-Class/SaveClip.App_656255807_18204969859331075_384029624559931374_n.jpg',
      '/assets/Mercedes-Benz G-Class/SaveClip.App_656266518_18089278423932129_1464736481894388292_n.jpg',
      '/assets/Mercedes-Benz G-Class/SaveClip.App_659777525_18118360048637458_9073244759963119633_n.jpg'
    ]
  },
  {
    id: 'mercedes-gle',
    make: 'Mercedes-Benz',
    model: 'GLE-Class',
    year: 2026,
    hp: 429,
    price: '$110,000',
    status: 'Available',
    watermarkText: 'GLE',
    image: '/assets/Mercedes-Benz GLE-Class/main.jpg',
    gallery: [
      '/assets/Mercedes-Benz GLE-Class/SaveClip.App_586669196_17929842186140792_4594363106052402487_n.jpg',
      '/assets/Mercedes-Benz GLE-Class/SaveClip.App_587269222_17929842195140792_7955917783270247023_n.jpg',
      '/assets/Mercedes-Benz GLE-Class/SaveClip.App_587284126_17929842213140792_7174517549680686246_n.jpg',
      '/assets/Mercedes-Benz GLE-Class/SaveClip.App_587793374_17929842222140792_9050985822598342139_n.jpg',
      '/assets/Mercedes-Benz GLE-Class/SaveClip.App_588629604_17929842204140792_7132805616757135251_n.jpg',
      '/assets/Mercedes-Benz GLE-Class/SaveClip.App_589242079_17929842177140792_6800307861942290969_n.jpg'
    ]
  },
  {
    id: 'nissan-fuga',
    make: 'Nissan',
    model: 'Fuga',
    year: 2026,
    hp: 328,
    price: '$60,000',
    status: 'Available',
    watermarkText: 'FUGA',
    image: '/assets/Nissan Fuga/main.jpg',
    gallery: [
      '/assets/Nissan Fuga/SaveClip.App_581357439_17928295095140792_5926582982365786262_n.jpg',
      '/assets/Nissan Fuga/SaveClip.App_581519482_17928295080140792_2455856967220625991_n.jpg',
      '/assets/Nissan Fuga/SaveClip.App_581542314_17928295068140792_1239144523338660405_n.jpg',
      '/assets/Nissan Fuga/SaveClip.App_581670073_17928295104140792_3355989821446484300_n.jpg',
      '/assets/Nissan Fuga/SaveClip.App_583043794_17928295059140792_5972436677055488878_n.jpg'
    ]
  },
  {
    id: 'toyota-lc300',
    make: 'Toyota',
    model: 'Land Cruiser 300 series',
    year: 2026,
    hp: 409,
    price: '$150,000',
    status: 'Available',
    watermarkText: 'LC300',
    image: '/assets/Toyota Land Cruiser 300 series/main.jpg',
    gallery: [
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_471836165_916065390591387_6726392414416639049_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_649361166_17915190600331471_7932701867398656143_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_650901366_17929995003215754_5890749422693484616_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_654014374_17962685822908016_2936458457199595394_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_654977314_18069392093283280_6258036108173864115_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_655070224_18137062567517235_9201078487715162691_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_655129047_18100362938482401_8536051254857003144_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_655515126_18069571766281635_8388522495990861785_n.jpg',
      '/assets/Toyota Land Cruiser 300 series/SaveClip.App_656267092_18101303417299949_3052101019579294200_n.jpg'
    ]
  }
];
