// File: constants/tracks.ts

// 1. ĐỊNH NGHĨA CẤU TRÚC CHO MỘT DÒNG LYRIC
export interface LyricLine {
  time: number; // Thời gian bắt đầu của dòng lyric (tính bằng giây)
  text: string; // Nội dung của dòng lyric
}

// 2. CẬP NHẬT INTERFACE TRACK ĐỂ CÓ THỂ CHỨA LYRICS
export interface Track {
  id: string;
  url: any;
  title: string;
  artist: string;
  artwork: any;
  duration: number; // Thời lượng tính bằng giây
  lyrics?: LyricLine[]; // Lyrics là một thuộc tính không bắt buộc
  downloadUrl?: string; // URL để tải file nhạc (không bắt buộc)
  localUrl?: string;
  genre?: string;
}

// 3. TẠO DỮ LIỆU LYRICS CHO MỘT BÀI HÁT
const simpleLoveLyrics: LyricLine[] = [
    // Intro/Nhạc dạo
    { time: 7.2, text: "Yeah-ee-yeah, yeah-ee-yeah, yeah-ee-yeah-ee-yeah" },
    { time: 13.0, text: "Uầy" }, // Đã chỉnh theo yêu cầu
    
    // VERSE 1 - OBITO (Đã lùi thời gian cho phù hợp)
    { time: 13.7, text: "Đưa chân dạo quanh nơi khắp phố xá bụi bay vào mắt, yah" },
    { time: 17.8, text: "Bụng reo đói mãi, anh tấp vào shop mua ly mì gói, yah" },
    { time: 21.5, text: "Đập vào đôi mắt anh muốn chới với, whoa, oh my god, whoa" },
    { time: 25.0, text: "Nàng tựa là ai xinh đến đắm đuối, không may thì ngất" },
    { time: 28.8, text: "Đứng chết im tức khắc, nàng nhẹ nhàng lướt qua" },
    { time: 32.5, text: "Tiếng sét ái tình đã đánh, xem như duyên chúng ta" },
    { time: 36.0, text: "Tay buông cả ly mì xuống, nhiều người nhìn quá đê" },
    { time: 39.5, text: "Anh không nói tiếng Hàn Quốc, nhưng biết nói saranghae" },
    
    // PRE-CHORUS - OBITO
    { time: 43.0, text: "Lo đứng mộng mơ em đi đâu mất, yahh" },
    { time: 45.0, text: "I'm fall in love, yahh" },
    { time: 46.4, text: "Đôi chân chạy nhanh hết tất ngóc ngách, to find you girl, yahh" },
    { time: 50.3, text: "Em trôi thật mau giữa đám đông bon chen người qua, yahh" },
    { time: 53.8, text: "Anh mãi chạy theo sau bóng em dẫu xa thật xa, yahh" },
    { time: 57.3, text: "Lạc vào hình bóng nàng, nét tinh tươm xinh ghê, yah" },
    { time: 60.8, text: "Em tựa tiên chốn nào ghé sang qua nơi anh vậy" },
    { time: 64.5, text: "Môi ngây ngô đỏ mềm, khiến anh như tan ra, yah" },
    { time: 67.9, text: "Thôi thì đã lỡ rồi mình trót yêu luôn em nha, yahhh" },

    // CHORUS - OBITO
    { time: 71.9, text: "Simple love, yah, simple love, yah" },
    { time: 75.4, text: "Simple love, simple love, oh simple love, yah" },
    { time: 79.2, text: "Ôi trên đấy giáng xuống thần tiên đi vào trong giấc mơ" },
    { time: 82.8, text: "Baby girl, I'm gonna say: \"You're the only one\"" },
    { time: 86.2, text: "Simple love, yah, simple love, yah" },
    { time: 89.8, text: "Simple love, simple love, oh simple love, yah" },
    { time: 93.3, text: "Rolling with me on the way, yo my candy girl" },
    { time: 96.9, text: "Saranghae, saranghae, simple love, girl" },
    
    // VERSE 2 - SEACHAINS
    { time: 101.1, text: "Bởi vì một phút ba mươi giây, nàng vút xa nơi đây, yeah" },
    { time: 104.5, text: "Đang nơi đâu, đi tìm hoài khắp nơi bao lâu, yeah" },
    { time: 108.0, text: "Thấy em đang ngồi trên ghế, ahh" },
    { time: 111.0, text: "Đôi Nike tinh tế, ahh" },
    { time: 112.5, text: "Ăn gì mà xinh thế, khiến anh quên luôn con đường về, yeah yeah" },
    
    // PRE-CHORUS - OBITO
    { time: 117.7, text: "Lạc vào hình bóng nàng, nét tinh tươm xinh ghê, yah" },
    { time: 121.2, text: "Em tựa tiên chốn nào ghé sang qua nơi anh vậy" },
    { time: 124.7, text: "Môi ngây ngô đỏ mềm, khiến anh như tan ra, yah" },
    { time: 128.2, text: "Thôi thì đã lỡ rồi mình trót yêu luôn em nha, yahhh" },

    // CHORUS - OBITO
    { time: 132.3, text: "Simple love, yah, simple love, yah" },
    { time: 135.8, text: "Simple love, simple love, oh simple love, yah" },
    { time: 139.5, text: "Ôi trên đấy giáng xuống thần tiên đi vào trong giấc mơ" },
    { time: 143.0, text: "Baby girl, I'm gonna say: \"You're the only one\"" },
    { time: 146.5, text: "Simple love, yah, simple love, yah" },
    { time: 150.0, text: "Simple love, simple love, oh simple love, yah" },
    { time: 153.5, text: "Rolling with me on the way, yo my candy girl" },
    { time: 157.0, text: "Saranghae, saranghae, simple love, girl" },
    
    // BRIDGE - LENA
    { time: 160.9, text: "Anh ơi, nên dừng lại, dừng lại để thấy đôi chân em mỏi mệt" },
    { time: 164.4, text: "Em đang thôi miên anh bằng nụ cười thật duyên" },

    // RAP - DAVIS
    { time: 166.4, text: "Lạc vào đồng cỏ xanh, thiên đường hoa bướm ong bay lượn" },
    { time: 169.4, text: "Tia lửa mém cầu kì, thiên đường không còn, nên nàng rơi vào nơi trần gian sao" },
    { time: 173.1, text: "Anh thì kiên cường, mong rằng gánh em bao phần gian lao" },
    { time: 176.2, text: "Việc gì phải ôm buồn đau, riêng mình ta, riêng mình ta" },
    { time: 179.7, text: "Nụ cười nở muôn ngàn hoa, muôn ngàn hoa, muôn ngàn hoa" },
    
    // CHORUS - OBITO & LENA
    { time: 183.3, text: "Simple love, yah, simple love, yah" },
    { time: 186.8, text: "Simple love, simple love, oh simple love, yah" },
    { time: 190.3, text: "Ôi trên đấy giáng xuống thần tiên đi vào trong giấc mơ" },
    { time: 193.8, text: "Baby girl, I'm gonna say: \"You're the only one\"" },
    { time: 197.3, text: "Simple love, yah, simple love, yah" },
    { time: 200.8, text: "Simple love, simple love, oh simple love, yah" },
    { time: 204.3, text: "Rolling with me on the way, yo my candy girl" },
    { time: 207.8, text: "Saranghae, saranghae, simple love, girl" },

    // OUTRO - OBITO
    { time: 211.3, text: "Thứ em thấy ở TV show, chẳng có đâu, tình yêu nhiệm màu" },
    { time: 214.8, text: "Don't believe what people show off, yeah, they just wanna show off" },
    { time: 218.3, text: "Show off, show off, show off, show off, show off" },
    { time: 221.7, text: "I just need a simple love, girl" },
];


// 4. CẬP NHẬT MẢNG TRACKS
export const TRACKS: Track[] = [
  {
    id: '1',
    url: require('../assets/audio/track1.mp3'),
    title: 'Nắng ấm xa dần',
    artist: 'Sơn Tùng M-TP',
    artwork: require('../assets/images/cover1.jpg'),
    duration: 255,
    // lyrics: ... (Bạn có thể thêm lyrics cho bài này)
    downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Pop',
  },
  {
    id: '2',
    url: require('../assets/audio/track2.mp3'),
    title: 'Em của ngày hôm qua',
    artist: 'Sơn Tùng M-TP',
    artwork: require('../assets/images/cover2.jpg'),
    duration: 224,
    downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Pop',
  },
  {
    id: '3',
    url: require('../assets/audio/track3.mp3'),
    title: 'Simple Love',
    artist: 'Obito & Seachains & Davis',
    artwork: require('../assets/images/cover3.jpg'),
    duration: 231,
    lyrics: simpleLoveLyrics, // <-- GÁN LYRICS VÀO ĐÂY
    genre: 'Rap',
  },
  {
    id: '4',
    url: require('../assets/audio/track4.wav'),
    title: 'WAV SONG',
    artist: 'Gia Huy',
    artwork: require('../assets/images/cover4.jpg'),
    duration: 231,
    genre: 'Rap',
  }
];