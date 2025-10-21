// File: hooks/useTrackColors.ts

import { useState, useEffect } from 'react';
import { Image } from 'react-native'; // <-- IMPORT Image từ react-native
import { Track } from '../constants/tracks';

const useTrackColors = (track: Track | null) => {
    // const [colors, setColors] = useState<ImageColorsResult | null>(null);

    // useEffect(() => {
    //     const fetchColors = async () => {
    //         if (!track?.artwork) {
    //             setColors(null); // Reset màu nếu không có ảnh
    //             return;
    //         }

    //         let imageUri: string;

    //         // Kiểm tra xem artwork là require() (number) hay là một chuỗi URI
    //         if (typeof track.artwork === 'number') {
    //             // Nếu là require(), dùng Image.resolveAssetSource để lấy URI
    //             const source = Image.resolveAssetSource(track.artwork);
    //             imageUri = source.uri;
    //         } else if (typeof track.artwork === 'string') {
    //             // Nếu đã là một chuỗi URI (cho ảnh từ internet)
    //             imageUri = track.artwork;
    //         } else {
    //             setColors(null);
    //             return;
    //         }

    //         try {
    //             const result = await getColors(imageUri, {
    //                 fallback: '#228B22',
    //                 cache: true,
    //                 key: track.id,
    //             });
    //             setColors(result);
    //         } catch (error) {
    //             console.error("Error getting image colors:", error);
    //             setColors(null);
    //         }
    //     };

    //     fetchColors();
    // }, [track]);

    // return colors;

    return null;
};

export default useTrackColors;