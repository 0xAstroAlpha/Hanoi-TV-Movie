import { ModelStyle } from '../types';

export const MODEL_STYLES: ModelStyle[] = [
    // === SINGLE CHARACTER MODELS (1 người) ===
    {
        id: 'chu-cu-van',
        name: 'Chử Cù Vân',
        title: 'Cha Cõng Con Trai',
        description: 'Người cha cõng con trai vượt sông. Cần upload 2 ảnh: 1 cha + 1 con.',
        imagePath: '/models/chu-cu-van.png',
        thumbPath: '/models/thumbs/chu-cu-van.jpg',
        visualPrompt: 'Cha già cõng con trai 3D Chibi, tình phụ tử ấm áp. Phong cách Pixar/Disney.',
        characterCount: 2
    },
    {
        id: 'chu-dong-tu-so-khai',
        name: 'Chử Đồng Tử Sơ Khai',
        title: 'Chàng Trai Nghèo Khổ',
        description: 'Chử Đồng Tử thời còn nghèo khổ.',
        imagePath: '/models/chu-dong-tu-so-khai.png',
        thumbPath: '/models/thumbs/chu-dong-tu-so-khai.jpg',
        visualPrompt: 'Chàng trai 3D Chibi trang phục giản dị, nét mặt hiền lành. Phong cách Pixar.',
        characterCount: 1
    },
    {
        id: 'gia-lang',
        name: 'Già Làng',
        title: 'Trưởng Lão Bộ Tộc',
        description: 'Già làng khôn ngoan với bộ râu trắng.',
        imagePath: '/models/gia-lang.png',
        thumbPath: '/models/thumbs/gia-lang.jpg',
        visualPrompt: 'Già làng 3D Chibi với râu trắng dài, trang phục bộ tộc, ánh mắt sáng suốt. Phong cách Disney.',
        characterCount: 1
    },
    {
        id: 'ha-bao-tran',
        name: 'Hà Bảo Trân',
        title: 'Mỹ Nhân Cổ Trang',
        description: 'Thiếu nữ xinh đẹp trong trang phục cổ.',
        imagePath: '/models/ha-bao-tran.png',
        thumbPath: '/models/thumbs/ha-bao-tran.jpg',
        visualPrompt: 'Thiếu nữ 3D Chibi trong trang phục cổ trang, nhan sắc tuyệt trần. Phong cách Pixar.',
        characterCount: 1
    },
    {
        id: 'kieu-tien',
        name: 'Kiều Tiên',
        title: 'Nàng Tiên Dịu Dàng',
        description: 'Nữ thần tiên xinh đẹp, dịu dàng.',
        imagePath: '/models/kieu-tien.png',
        thumbPath: '/models/thumbs/kieu-tien.jpg',
        visualPrompt: 'Nàng tiên 3D Chibi với trang phục mềm mại, nét đẹp thanh thoát. Phong cách Disney.',
        characterCount: 1
    },
    {
        id: 'tho-phi',
        name: 'Thổ Phỉ',
        title: 'Chiến Binh Giáp Vàng',
        description: 'Chiến binh với giáp vàng, mũ kim loại, búa rìu + đinh ba.',
        imagePath: '/models/tho-phi.png',
        thumbPath: '/models/thumbs/tho-phi.jpg',
        visualPrompt: 'Chiến binh 3D Chibi với giáp vàng, mũ kim loại đồng, tay cầm búa rìu vàng và đinh ba. Phong cách Pixar/Disney.',
        characterCount: 1
    },
    {
        id: 'tien-dung',
        name: 'Tiên Dung',
        title: 'Công Chúa Tiên Dung',
        description: 'Công chúa xinh đẹp con vua Hùng.',
        imagePath: '/models/tien-dung.jpg',
        thumbPath: '/models/thumbs/tien-dung.jpg',
        visualPrompt: 'Công chúa 3D Chibi trong trang phục hoàng gia, nét đẹp cao quý. Phong cách Disney.',
        characterCount: 1
    },
    {
        id: 'trieu-lac-tuong',
        name: 'Triệu Lạc Tướng',
        title: 'Thủ Lĩnh Lông Vũ',
        description: 'Thủ lĩnh bộ tộc với mũ lông vũ nhiều màu sắc.',
        imagePath: '/models/trieu-lac-tuong.png',
        thumbPath: '/models/thumbs/trieu-lac-tuong.jpg',
        visualPrompt: 'Thủ lĩnh bộ tộc 3D Chibi với mũ lông vũ đỏ trắng nâu, áo choàng hồng kẻ sọc, giáp ngực vàng. Phong cách Disney/Pixar.',
        characterCount: 1
    },
    {
        id: 'trieu-minh-lam',
        name: 'Triệu Minh Lâm',
        title: 'Tướng Quân Anh Tuấn',
        description: 'Tướng quân trẻ tuổi, anh tuấn.',
        imagePath: '/models/trieu-minh-lam.png',
        thumbPath: '/models/thumbs/trieu-minh-lam.jpg',
        visualPrompt: 'Tướng quân 3D Chibi trẻ tuổi, trang phục võ tướng. Phong cách Pixar.',
        characterCount: 1
    },
    {
        id: 'xuong-cuong',
        name: 'Xương Cuồng',
        title: 'Cuồng Chiến Song Đao',
        description: 'Chiến binh tóc dài hoang dã, song đao vàng.',
        imagePath: '/models/xuong-cuong.png',
        thumbPath: '/models/thumbs/xuong-cuong.jpg',
        visualPrompt: 'Chiến binh hoang dã 3D Chibi với tóc đen dài bay, râu rậm, ngực trần với dây đeo chéo nâu, váy xám, hai tay cầm song đao vàng cong. Phong cách Pixar.',
        characterCount: 1
    },

    // === COUPLE/PAIR MODELS (2 người) ===
    {
        id: 'chu-dong-tu-tien-dung',
        name: 'Chử Đồng Tử & Tiên Dung',
        title: 'Đôi Uyên Ương Huyền Thoại',
        description: 'Cặp đôi huyền thoại trong trang phục cổ trang. Cần upload 2 ảnh: 1 nam + 1 nữ.',
        imagePath: '/models/chu-dong-tu-tien-dung.png',
        thumbPath: '/models/thumbs/chu-dong-tu-tien-dung.jpg',
        visualPrompt: 'Cặp đôi 3D Chibi trong trang phục cổ trang Việt, nét đẹp tình tứ. Phong cách Disney.',
        characterCount: 2
    },
    {
        id: 'me-con',
        name: 'Mẹ Con',
        title: 'Tình Mẫu Tử',
        description: 'Hình ảnh mẹ con ấm áp. Cần upload 2 ảnh: 1 mẹ + 1 con.',
        imagePath: '/models/me-con.jpg',
        thumbPath: '/models/thumbs/me-con.jpg',
        visualPrompt: 'Mẹ và con 3D Chibi, tình cảm ấm áp. Phong cách Pixar.',
        characterCount: 2
    },
    {
        id: 'vua-tien-dung',
        name: 'Vua & Tiên Dung',
        title: 'Hoàng Gia Đại Việt',
        description: 'Vua và hoàng hậu Tiên Dung. Cần upload 2 ảnh: 1 nam + 1 nữ.',
        imagePath: '/models/vua-tien-dung.png',
        thumbPath: '/models/thumbs/vua-tien-dung.jpg',
        visualPrompt: 'Cặp đôi hoàng gia 3D Chibi trong trang phục vua chúa. Phong cách Pixar.',
        characterCount: 2
    },
    {
        id: 'vua-vo-vua',
        name: 'Vua & Vợ Vua',
        title: 'Quốc Vương Phu Thê',
        description: 'Nhà vua và hoàng hậu bên nhau. Cần upload 2 ảnh: 1 nam + 1 nữ.',
        imagePath: '/models/vua-vo-vua.png',
        thumbPath: '/models/thumbs/vua-vo-vua.jpg',
        visualPrompt: 'Cặp đôi hoàng gia 3D Chibi hạnh phúc bên nhau. Phong cách Disney.',
        characterCount: 2
    },
    {
        id: 'vua-chu-1',
        name: 'Cha Cõng Con',
        title: 'Tình Phụ Tử',
        description: 'Cha cõng con trên lưng. Cần upload 2 ảnh: 1 cha + 1 con.',
        imagePath: '/models/vua-chu-1.jpg',
        thumbPath: '/models/thumbs/vua-chu-1.jpg',
        visualPrompt: 'Cha cõng con 3D Chibi, tình cha con ấm áp. Phong cách Pixar.',
        characterCount: 2
    },
    {
        id: 'vua-chu-2',
        name: 'Vua & Chử Đồng Tử',
        title: 'Gặp Gỡ Định Mệnh',
        description: 'Vua gặp Chử Đồng Tử. Cần upload 2 ảnh.',
        imagePath: '/models/vua-chu-2.jpg',
        thumbPath: '/models/thumbs/vua-chu-2.jpg',
        visualPrompt: 'Vua và chàng trai 3D Chibi, khoảnh khắc gặp gỡ. Phong cách Disney.',
        characterCount: 2
    },
    {
        id: 'vua-chu-3',
        name: 'Vua Mời Rượu',
        title: 'Hoàng Gia Tiệc Vui',
        description: 'Vua mời rượu. Cần upload 2 ảnh.',
        imagePath: '/models/vua-chu-3.png',
        thumbPath: '/models/thumbs/vua-chu-3.jpg',
        visualPrompt: 'Vua và người hầu 3D Chibi cùng nâng ly. Phong cách Pixar.',
        characterCount: 2
    },
    {
        id: 'vua-chu-dong-tu',
        name: 'Vua Gặp Chử Đồng Tử',
        title: 'Thiên Duyên Kỳ Ngộ',
        description: 'Cuộc gặp gỡ giữa Vua và Chử Đồng Tử. Cần upload 2 ảnh.',
        imagePath: '/models/vua-chu-dong-tu.png',
        thumbPath: '/models/thumbs/vua-chu-dong-tu.jpg',
        visualPrompt: 'Vua và Chử Đồng Tử 3D Chibi giao tiếp. Phong cách Disney.',
        characterCount: 2
    },
    {
        id: 'vo-vua-tien-dung',
        name: 'Hoàng Hậu & Tiên Dung',
        title: 'Hai Nàng Đài Các',
        description: 'Hai người phụ nữ hoàng gia. Cần upload 2 ảnh nữ.',
        imagePath: '/models/vo-vua-tien-dung.jpg',
        thumbPath: '/models/thumbs/vo-vua-tien-dung.jpg',
        visualPrompt: 'Hai phụ nữ hoàng gia 3D Chibi trong trang phục sang trọng. Phong cách Disney.',
        characterCount: 2
    }
];

// Helper to get models by type
export const getSingleModels = () => MODEL_STYLES.filter(m => m.characterCount === 1);
export const getCoupleModels = () => MODEL_STYLES.filter(m => m.characterCount === 2);
