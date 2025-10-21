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
// Lấy ví dụ bài "Simple Love"
const simpleLoveLyrics: LyricLine[] = [
    { time: 15.5, text: "Simple love, simple love" },
    { time: 19.0, text: "Chẳng cần phô trương, chẳng cần những món quà xa hoa" },
    { time: 23.0, text: "Chỉ cần em ở đây, cùng anh qua bao tháng ngày" },
    { time: 26.5, text: "Simple love, simple love" },
    { time: 30.0, text: "Là những quan tâm, là những yêu thương thật giản đơn" },
    { time: 34.0, text: "Cùng nhau đi muôn nơi, mình sống cuộc đời ta mơ" },
    { time: 38.0, text: "Hey em, anh chẳng có gì ngoài con tim chân thành" },
    { time: 42.0, text: "Và một tình yêu simple, anh dành cho em" },
    { time: 45.5, text: "Chẳng cần xe sang, hay là những lâu đài nguy nga" },
    { time: 49.5, text: "Chỉ cần một mái nhà, có em và có anh" },
    //... thêm các dòng khác nếu bạn muốn
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
];