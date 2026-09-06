
        /* ========== 获取消息内容 ========== */
        function getMessageData() {
            var chatMessages = getChatMessages(getCurrentMessageId());
            if (!chatMessages || chatMessages.length === 0) return null;
            return chatMessages[0].message;
        }

        /* ========== 解析数据 ========== */
        function parseData(messageText) {
            var result = {
                role: '未知', jpName: '', time: '未知',
                location: '未知', weather: '未知',
                imgUrl: '', outfit: '无描述', voice: '...'
            };

            var tagMatch = messageText.match(/<status_panel>([\s\S]*?)<\/status_panel>/);
            if (!tagMatch || !tagMatch[1]) return null;

            var lines = tagMatch[1].trim().split('\n');
            lines.forEach(function(line) {
                var match = line.match(/\[(.*?)\|(.*?)\]/);
                if (match && match.length >= 3) {
                    var key = match[1].trim();
                    var value = match[2].trim();
                    if (key === '角色') result.role = value;
                    else if (key === '日文名') result.jpName = value;
                    else if (key === '时间') result.time = value;
                    else if (key === '地点') result.location = value;
                        else if (key === '澪位置') result.mioLoc = value;
                        else if (key === '鹤位置') result.tsuruLoc = value;
                    else if (key === '天气') result.weather = value;
                    else if (key === '插图') result.imgUrl = value;
                    else if (key === '打扮') result.outfit = value;
                    else if (key === '内心话') result.voice = value;
                }
            });
            result.raw = messageText;
            return result;
        }

        function getThemeClass(roleName) {
            if (roleName.indexOf('澪') !== -1) return 'theme-mio';
            if (roleName.indexOf('鹤') !== -1) return 'theme-tsuru';
            return 'theme-mio'; /* 默认 */
        }

        function getAvatarText(roleName) {
            if (roleName.indexOf('澪') !== -1) return '澪';
            if (roleName.indexOf('鹤') !== -1) return '鶴';
            return roleName.charAt(0) || '?';
        }

        /* 左上角头像：GitHub 仓库直链（仓库内替换同名文件即换图，无需改卡） */
        var UW_AVATARS = {
            mio: [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-li-hui/main/%E6%BE%AA_%E5%A4%B4%E5%83%8F_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-li-hui/main/%E6%BE%AA_%E5%A4%B4%E5%83%8F_2.png'
            ],
            tsuru: [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-li-hui/main/%E9%B9%A4_%E5%A4%B4%E5%83%8F_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-li-hui/main/%E9%B9%A4_%E5%A4%B4%E5%83%8F_2.png'
            ]
        };

        function getAvatarUrl(roleName) {
            var list = null;
            if (roleName.indexOf('澪') !== -1) list = UW_AVATARS.mio;
            else if (roleName.indexOf('鹤') !== -1) list = UW_AVATARS.tsuru;
            else return '';
            return list[Math.floor(Math.random() * list.length)] || '';
        }


        /* 前端画廊：bingruo-tu-1 仓库直链（角色_场景_动作_1~5），按地点+正文自动配图 */
                var UW_GALLERY_BASE = 'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/';
        var UW_GALLERY_FILES = {
            '澪_家门口_逛街': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6%E9%97%A8%E5%8F%A3_%E9%80%9B%E8%A1%97_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6%E9%97%A8%E5%8F%A3_%E9%80%9B%E8%A1%97_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6%E9%97%A8%E5%8F%A3_%E9%80%9B%E8%A1%97_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6%E9%97%A8%E5%8F%A3_%E9%80%9B%E8%A1%97_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6%E9%97%A8%E5%8F%A3_%E9%80%9B%E8%A1%97_5.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6%E9%97%A8%E5%8F%A3_%E9%80%9B%E8%A1%97_6.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6%E9%97%A8%E5%8F%A3_%E9%80%9B%E8%A1%97_7.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6%E9%97%A8%E5%8F%A3_%E9%80%9B%E8%A1%97_8.png'
            ],
            '澪_村口_逛街': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%8F%A3_%E9%80%9B%E8%A1%97_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%8F%A3_%E9%80%9B%E8%A1%97_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%8F%A3_%E9%80%9B%E8%A1%97_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%8F%A3_%E9%80%9B%E8%A1%97_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%8F%A3_%E9%80%9B%E8%A1%97_5.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%8F%A3_%E9%80%9B%E8%A1%97_6.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%8F%A3_%E9%80%9B%E8%A1%97_7.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%8F%A3_%E9%80%9B%E8%A1%97_8.png'
            ],
            '澪_村内_逛街': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%86%85_%E9%80%9B%E8%A1%97_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%86%85_%E9%80%9B%E8%A1%97_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%86%85_%E9%80%9B%E8%A1%97_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%86%85_%E9%80%9B%E8%A1%97_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%86%85_%E9%80%9B%E8%A1%97_5.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%86%85_%E9%80%9B%E8%A1%97_6.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%86%85_%E9%80%9B%E8%A1%97_7.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%91%E5%86%85_%E9%80%9B%E8%A1%97_8.png'
            ],
            '澪_家_吹风扇': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%B9%E9%A3%8E%E6%89%87_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%B9%E9%A3%8E%E6%89%87_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%B9%E9%A3%8E%E6%89%87_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%B9%E9%A3%8E%E6%89%87_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%B9%E9%A3%8E%E6%89%87_5.png'
            ],
            '澪_家_一起洗澡': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E4%B8%80%E8%B5%B7%E6%B4%97%E6%BE%A1_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E4%B8%80%E8%B5%B7%E6%B4%97%E6%BE%A1_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E4%B8%80%E8%B5%B7%E6%B4%97%E6%BE%A1_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E4%B8%80%E8%B5%B7%E6%B4%97%E6%BE%A1_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E4%B8%80%E8%B5%B7%E6%B4%97%E6%BE%A1_5.png'
            ],
            '澪_家_怀里写作业': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%80%80%E9%87%8C%E5%86%99%E4%BD%9C%E4%B8%9A_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%80%80%E9%87%8C%E5%86%99%E4%BD%9C%E4%B8%9A_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%80%80%E9%87%8C%E5%86%99%E4%BD%9C%E4%B8%9A_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%80%80%E9%87%8C%E5%86%99%E4%BD%9C%E4%B8%9A_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%80%80%E9%87%8C%E5%86%99%E4%BD%9C%E4%B8%9A_5.png'
            ],
            '澪_家_怀里睡觉': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%80%80%E9%87%8C%E7%9D%A1%E8%A7%89_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%80%80%E9%87%8C%E7%9D%A1%E8%A7%89_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%80%80%E9%87%8C%E7%9D%A1%E8%A7%89_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%80%80%E9%87%8C%E7%9D%A1%E8%A7%89_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%80%80%E9%87%8C%E7%9D%A1%E8%A7%89_5.png'
            ],
            '澪_家_写作业': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%86%99%E4%BD%9C%E4%B8%9A_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%86%99%E4%BD%9C%E4%B8%9A_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%86%99%E4%BD%9C%E4%B8%9A_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%86%99%E4%BD%9C%E4%B8%9A_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%86%99%E4%BD%9C%E4%B8%9A_5.png'
            ],
            '澪_家_听收音机': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%AC%E6%94%B6%E9%9F%B3%E6%9C%BA_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%AC%E6%94%B6%E9%9F%B3%E6%9C%BA_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%AC%E6%94%B6%E9%9F%B3%E6%9C%BA_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%AC%E6%94%B6%E9%9F%B3%E6%9C%BA_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%AC%E6%94%B6%E9%9F%B3%E6%9C%BA_5.png'
            ],
            '澪_家_吃汉堡肉': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E6%B1%89%E5%A0%A1%E8%82%89_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E6%B1%89%E5%A0%A1%E8%82%89_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E6%B1%89%E5%A0%A1%E8%82%89_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E6%B1%89%E5%A0%A1%E8%82%89_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E6%B1%89%E5%A0%A1%E8%82%89_5.png'
            ],
            '澪_家_吃刨冰': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E5%88%A8%E5%86%B0_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E5%88%A8%E5%86%B0_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E5%88%A8%E5%86%B0_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E5%88%A8%E5%86%B0_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E5%88%A8%E5%86%B0_5.png'
            ],
            '澪_家_吃冰棍': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E5%86%B0%E6%A3%8D_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E5%86%B0%E6%A3%8D_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E5%86%B0%E6%A3%8D_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E5%86%B0%E6%A3%8D_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E5%86%B0%E6%A3%8D_5.png'
            ],
            '澪_家_吃饭': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E9%A5%AD_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E9%A5%AD_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E9%A5%AD_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E9%A5%AD_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E5%90%83%E9%A5%AD_5.png'
            ],
            '澪_家_看电视': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%9C%8B%E7%94%B5%E8%A7%86_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%9C%8B%E7%94%B5%E8%A7%86_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%9C%8B%E7%94%B5%E8%A7%86_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%9C%8B%E7%94%B5%E8%A7%86_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%9C%8B%E7%94%B5%E8%A7%86_5.png'
            ],
            '澪_家_洗漱': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%B4%97%E6%BC%B1_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%B4%97%E6%BC%B1_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%B4%97%E6%BC%B1_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%B4%97%E6%BC%B1_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%B4%97%E6%BC%B1_5.png'
            ],
            '澪_家_玄关出门': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%8E%84%E5%85%B3%E5%87%BA%E9%97%A8_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%8E%84%E5%85%B3%E5%87%BA%E9%97%A8_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%8E%84%E5%85%B3%E5%87%BA%E9%97%A8_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%8E%84%E5%85%B3%E5%87%BA%E9%97%A8_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%8E%84%E5%85%B3%E5%87%BA%E9%97%A8_5.png'
            ],
            '澪_家_睡醒': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%9D%A1%E9%86%92_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%9D%A1%E9%86%92_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%9D%A1%E9%86%92_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%9D%A1%E9%86%92_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E7%9D%A1%E9%86%92_5.png'
            ],
            '澪_家_沙发睡觉': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%B2%99%E5%8F%91%E7%9D%A1%E8%A7%89_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%B2%99%E5%8F%91%E7%9D%A1%E8%A7%89_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%B2%99%E5%8F%91%E7%9D%A1%E8%A7%89_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%B2%99%E5%8F%91%E7%9D%A1%E8%A7%89_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%B2%99%E5%8F%91%E7%9D%A1%E8%A7%89_5.png'
            ],
            '澪_家_暖炉休息': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%9A%96%E7%82%89%E4%BC%91%E6%81%AF_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%9A%96%E7%82%89%E4%BC%91%E6%81%AF_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%9A%96%E7%82%89%E4%BC%91%E6%81%AF_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%9A%96%E7%82%89%E4%BC%91%E6%81%AF_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%AE%B6_%E6%9A%96%E7%82%89%E4%BC%91%E6%81%AF_5.png'
            ],
            '澪_人工海水浴场_闲逛': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E9%97%B2%E9%80%9B_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E9%97%B2%E9%80%9B_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E9%97%B2%E9%80%9B_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E9%97%B2%E9%80%9B_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E9%97%B2%E9%80%9B_5.png'
            ],
            '澪_人工海水浴场_吃刨冰': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E5%90%83%E5%88%A8%E5%86%B0_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E5%90%83%E5%88%A8%E5%86%B0_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E5%90%83%E5%88%A8%E5%86%B0_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E5%90%83%E5%88%A8%E5%86%B0_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E5%90%83%E5%88%A8%E5%86%B0_5.png'
            ],
            '澪_人工海水浴场_游泳': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E6%B8%B8%E6%B3%B3_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E6%B8%B8%E6%B3%B3_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E6%B8%B8%E6%B3%B3_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E6%B8%B8%E6%B3%B3_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E6%B8%B8%E6%B3%B3_5.png'
            ],
            '澪_人工海水浴场_休息': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E4%BC%91%E6%81%AF_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E4%BC%91%E6%81%AF_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E4%BC%91%E6%81%AF_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E4%BC%91%E6%81%AF_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BA%BA%E5%B7%A5%E6%B5%B7%E6%B0%B4%E6%B5%B4%E5%9C%BA_%E4%BC%91%E6%81%AF_5.png'
            ],
            '澪_海边_非泳装': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E9%9D%9E%E6%B3%B3%E8%A3%85_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E9%9D%9E%E6%B3%B3%E8%A3%85_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E9%9D%9E%E6%B3%B3%E8%A3%85_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E9%9D%9E%E6%B3%B3%E8%A3%85_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E9%9D%9E%E6%B3%B3%E8%A3%85_5.png'
            ],
            '澪_海边_泳装': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E6%B3%B3%E8%A3%85_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E6%B3%B3%E8%A3%85_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E6%B3%B3%E8%A3%85_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E6%B3%B3%E8%A3%85_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E6%B3%B3%E8%A3%85_5.png'
            ],
            '澪_海边_赶海': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E8%B5%B6%E6%B5%B7_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E8%B5%B6%E6%B5%B7_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E8%B5%B6%E6%B5%B7_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E8%B5%B6%E6%B5%B7_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E8%BE%B9_%E8%B5%B6%E6%B5%B7_5.png'
            ],
            '澪_体育馆_休息': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BD%93%E8%82%B2%E9%A6%86_%E4%BC%91%E6%81%AF_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BD%93%E8%82%B2%E9%A6%86_%E4%BC%91%E6%81%AF_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BD%93%E8%82%B2%E9%A6%86_%E4%BC%91%E6%81%AF_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BD%93%E8%82%B2%E9%A6%86_%E4%BC%91%E6%81%AF_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BD%93%E8%82%B2%E9%A6%86_%E4%BC%91%E6%81%AF_5.png'
            ],
            '澪_体育馆_闲逛': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BD%93%E8%82%B2%E9%A6%86_%E9%97%B2%E9%80%9B_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BD%93%E8%82%B2%E9%A6%86_%E9%97%B2%E9%80%9B_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BD%93%E8%82%B2%E9%A6%86_%E9%97%B2%E9%80%9B_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BD%93%E8%82%B2%E9%A6%86_%E9%97%B2%E9%80%9B_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E4%BD%93%E8%82%B2%E9%A6%86_%E9%97%B2%E9%80%9B_5.png'
            ],
            '澪_古本屋_看书': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%8F%A4%E6%9C%AC%E5%B1%8B_%E7%9C%8B%E4%B9%A6_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%8F%A4%E6%9C%AC%E5%B1%8B_%E7%9C%8B%E4%B9%A6_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%8F%A4%E6%9C%AC%E5%B1%8B_%E7%9C%8B%E4%B9%A6_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%8F%A4%E6%9C%AC%E5%B1%8B_%E7%9C%8B%E4%B9%A6_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%8F%A4%E6%9C%AC%E5%B1%8B_%E7%9C%8B%E4%B9%A6_5.png'
            ],
            '澪_古本屋_休息': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%8F%A4%E6%9C%AC%E5%B1%8B_%E4%BC%91%E6%81%AF_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%8F%A4%E6%9C%AC%E5%B1%8B_%E4%BC%91%E6%81%AF_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%8F%A4%E6%9C%AC%E5%B1%8B_%E4%BC%91%E6%81%AF_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%8F%A4%E6%9C%AC%E5%B1%8B_%E4%BC%91%E6%81%AF_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%8F%A4%E6%9C%AC%E5%B1%8B_%E4%BC%91%E6%81%AF_5.png'
            ],
            '澪_商店_购物': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%95%86%E5%BA%97_%E8%B4%AD%E7%89%A9_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%95%86%E5%BA%97_%E8%B4%AD%E7%89%A9_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%95%86%E5%BA%97_%E8%B4%AD%E7%89%A9_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%95%86%E5%BA%97_%E8%B4%AD%E7%89%A9_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%95%86%E5%BA%97_%E8%B4%AD%E7%89%A9_5.png'
            ],
            '澪_杉木林道_闲逛': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E9%97%B2%E9%80%9B_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E9%97%B2%E9%80%9B_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E9%97%B2%E9%80%9B_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E9%97%B2%E9%80%9B_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E9%97%B2%E9%80%9B_5.png'
            ],
            '澪_杉木林道_寻宝': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E5%AF%BB%E5%AE%9D_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E5%AF%BB%E5%AE%9D_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E5%AF%BB%E5%AE%9D_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E5%AF%BB%E5%AE%9D_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E5%AF%BB%E5%AE%9D_5.png'
            ],
            '澪_杉木林道_休息': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E4%BC%91%E6%81%AF_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E4%BC%91%E6%81%AF_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E4%BC%91%E6%81%AF_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E4%BC%91%E6%81%AF_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%9D%89%E6%9C%A8%E6%9E%97%E9%81%93_%E4%BC%91%E6%81%AF_5.png'
            ],
            '澪_海鸣小学旧址_闲逛': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E9%97%B2%E9%80%9B_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E9%97%B2%E9%80%9B_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E9%97%B2%E9%80%9B_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E9%97%B2%E9%80%9B_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E9%97%B2%E9%80%9B_5.png'
            ],
            '澪_海鸣小学旧址_玩乐': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E7%8E%A9%E4%B9%90_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E7%8E%A9%E4%B9%90_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E7%8E%A9%E4%B9%90_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E7%8E%A9%E4%B9%90_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E7%8E%A9%E4%B9%90_5.png'
            ],
            '澪_海鸣小学旧址_休息': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E4%BC%91%E6%81%AF_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E4%BC%91%E6%81%AF_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E4%BC%91%E6%81%AF_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E4%BC%91%E6%81%AF_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E5%B0%8F%E5%AD%A6%E6%97%A7%E5%9D%80_%E4%BC%91%E6%81%AF_5.png'
            ],
            '澪_海鸣神社_参拜': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E5%8F%82%E6%8B%9C_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E5%8F%82%E6%8B%9C_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E5%8F%82%E6%8B%9C_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E5%8F%82%E6%8B%9C_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E5%8F%82%E6%8B%9C_5.png'
            ],
            '澪_海鸣神社_休息': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E4%BC%91%E6%81%AF_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E4%BC%91%E6%81%AF_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E4%BC%91%E6%81%AF_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E4%BC%91%E6%81%AF_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E4%BC%91%E6%81%AF_5.png'
            ],
            '澪_海鸣神社_闲逛': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E9%97%B2%E9%80%9B_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E9%97%B2%E9%80%9B_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E9%97%B2%E9%80%9B_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E9%97%B2%E9%80%9B_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%B5%B7%E9%B8%A3%E7%A5%9E%E7%A4%BE_%E9%97%B2%E9%80%9B_5.png'
            ],
            '澪_潮汤_泡温泉': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E6%B3%A1%E6%B8%A9%E6%B3%89_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E6%B3%A1%E6%B8%A9%E6%B3%89_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E6%B3%A1%E6%B8%A9%E6%B3%89_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E6%B3%A1%E6%B8%A9%E6%B3%89_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E6%B3%A1%E6%B8%A9%E6%B3%89_5.png'
            ],
            '澪_潮汤_喝牛奶': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E5%96%9D%E7%89%9B%E5%A5%B6_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E5%96%9D%E7%89%9B%E5%A5%B6_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E5%96%9D%E7%89%9B%E5%A5%B6_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E5%96%9D%E7%89%9B%E5%A5%B6_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E5%96%9D%E7%89%9B%E5%A5%B6_5.png'
            ],
            '澪_潮汤_清洗身体': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E6%B8%85%E6%B4%97%E8%BA%AB%E4%BD%93_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E6%B8%85%E6%B4%97%E8%BA%AB%E4%BD%93_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E6%B8%85%E6%B4%97%E8%BA%AB%E4%BD%93_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E6%B8%85%E6%B4%97%E8%BA%AB%E4%BD%93_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%BD%AE%E6%B1%A4_%E6%B8%85%E6%B4%97%E8%BA%AB%E4%BD%93_5.png'
            ],
            '澪_炭窑遗址_闲逛': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E9%97%B2%E9%80%9B_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E9%97%B2%E9%80%9B_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E9%97%B2%E9%80%9B_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E9%97%B2%E9%80%9B_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E9%97%B2%E9%80%9B_5.png'
            ],
            '澪_炭窑遗址_寻宝': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E5%AF%BB%E5%AE%9D_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E5%AF%BB%E5%AE%9D_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E5%AF%BB%E5%AE%9D_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E5%AF%BB%E5%AE%9D_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E5%AF%BB%E5%AE%9D_5.png'
            ],
            '澪_炭窑遗址_休息': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E4%BC%91%E6%81%AF_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E4%BC%91%E6%81%AF_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E4%BC%91%E6%81%AF_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E4%BC%91%E6%81%AF_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%82%AD%E7%AA%91%E9%81%97%E5%9D%80_%E4%BC%91%E6%81%AF_5.png'
            ],
            '澪_离岸提_闲逛': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%A6%BB%E5%B2%B8%E6%8F%90_%E9%97%B2%E9%80%9B_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%A6%BB%E5%B2%B8%E6%8F%90_%E9%97%B2%E9%80%9B_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%A6%BB%E5%B2%B8%E6%8F%90_%E9%97%B2%E9%80%9B_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%A6%BB%E5%B2%B8%E6%8F%90_%E9%97%B2%E9%80%9B_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%A6%BB%E5%B2%B8%E6%8F%90_%E9%97%B2%E9%80%9B_5.png'
            ],
            '澪_离岸提_看星星': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%A6%BB%E5%B2%B8%E6%8F%90_%E7%9C%8B%E6%98%9F%E6%98%9F_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%A6%BB%E5%B2%B8%E6%8F%90_%E7%9C%8B%E6%98%9F%E6%98%9F_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%A6%BB%E5%B2%B8%E6%8F%90_%E7%9C%8B%E6%98%9F%E6%98%9F_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%A6%BB%E5%B2%B8%E6%8F%90_%E7%9C%8B%E6%98%9F%E6%98%9F_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%A6%BB%E5%B2%B8%E6%8F%90_%E7%9C%8B%E6%98%9F%E6%98%9F_5.png'
            ],
            '澪_肉的坂本_买可乐饼': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%82%89%E7%9A%84%E5%9D%82%E6%9C%AC_%E4%B9%B0%E5%8F%AF%E4%B9%90%E9%A5%BC_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%82%89%E7%9A%84%E5%9D%82%E6%9C%AC_%E4%B9%B0%E5%8F%AF%E4%B9%90%E9%A5%BC_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%82%89%E7%9A%84%E5%9D%82%E6%9C%AC_%E4%B9%B0%E5%8F%AF%E4%B9%90%E9%A5%BC_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%82%89%E7%9A%84%E5%9D%82%E6%9C%AC_%E4%B9%B0%E5%8F%AF%E4%B9%90%E9%A5%BC_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%82%89%E7%9A%84%E5%9D%82%E6%9C%AC_%E4%B9%B0%E5%8F%AF%E4%B9%90%E9%A5%BC_5.png'
            ],
            '澪_肉的坂本_挑猪肉': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%82%89%E7%9A%84%E5%9D%82%E6%9C%AC_%E6%8C%91%E7%8C%AA%E8%82%89_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%82%89%E7%9A%84%E5%9D%82%E6%9C%AC_%E6%8C%91%E7%8C%AA%E8%82%89_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%82%89%E7%9A%84%E5%9D%82%E6%9C%AC_%E6%8C%91%E7%8C%AA%E8%82%89_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%82%89%E7%9A%84%E5%9D%82%E6%9C%AC_%E6%8C%91%E7%8C%AA%E8%82%89_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%82%89%E7%9A%84%E5%9D%82%E6%9C%AC_%E6%8C%91%E7%8C%AA%E8%82%89_5.png'
            ],
            '澪_车站_等车': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%BD%A6%E7%AB%99_%E7%AD%89%E8%BD%A6_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%BD%A6%E7%AB%99_%E7%AD%89%E8%BD%A6_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%BD%A6%E7%AB%99_%E7%AD%89%E8%BD%A6_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%BD%A6%E7%AB%99_%E7%AD%89%E8%BD%A6_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E8%BD%A6%E7%AB%99_%E7%AD%89%E8%BD%A6_5.png'
            ],
            '澪_龙王崎展望台_闲逛': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E9%97%B2%E9%80%9B_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E9%97%B2%E9%80%9B_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E9%97%B2%E9%80%9B_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E9%97%B2%E9%80%9B_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E9%97%B2%E9%80%9B_5.png'
            ],
            '澪_龙王崎展望台_钓鱼': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E9%92%93%E9%B1%BC_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E9%92%93%E9%B1%BC_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E9%92%93%E9%B1%BC_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E9%92%93%E9%B1%BC_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E9%92%93%E9%B1%BC_5.png'
            ],
            '澪_龙王崎展望台_休息': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E4%BC%91%E6%81%AF_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E4%BC%91%E6%81%AF_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E4%BC%91%E6%81%AF_3.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E4%BC%91%E6%81%AF_4.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E9%BE%99%E7%8E%8B%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0_%E4%BC%91%E6%81%AF_5.png'
            ],
            '澪_婚纱_婚纱': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%A9%9A%E7%BA%B1_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%A9%9A%E7%BA%B1_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E5%A9%9A%E7%BA%B1_3.png'
            ],
            '澪_怀孕_怀孕': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%80%80%E5%AD%95_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%80%80%E5%AD%95_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E6%80%80%E5%AD%95_3.png'
            ],
            '澪_生子_生子': [
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%94%9F%E5%AD%90_1.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%94%9F%E5%AD%90_2.png',
                'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/%E6%BE%AA_%E7%94%9F%E5%AD%90_3.png'
            ],
        };
        var UW_GALLERY_SCENES = [
        {
            name: '家门口',
            keys: ['家门口', '门口', '大门'],
            fallback: '逛街',
            actions: [
                { act: '逛街', keys: ['逛', '散步', '出门', '闲逛'] }
            ]
        },
        {
            name: '村口',
            keys: ['村口'],
            fallback: '逛街',
            actions: [
                { act: '逛街', keys: ['逛', '散步', '出门', '闲逛'] }
            ]
        },
        {
            name: '村内',
            keys: ['村内', '村里', '村子'],
            fallback: '逛街',
            actions: [
                { act: '逛街', keys: ['逛', '散步', '出门', '闲逛'] }
            ]
        },
        {
            name: '家',
            keys: ['老宅', '二楼', '房间', '客厅', '厨房', '餐厅', '饭厅', '院子', '玄关', '宅', '家'],
            fallback: '吹风扇',
            actions: [
                { act: '一起洗澡', keys: ['洗澡', '浴室', '泡澡'] },
                { act: '怀里写作业', keys: ['怀里写', '怀中写', '腿上写', '怀里做', '怀里听课'] },
                { act: '怀里睡觉', keys: ['怀里睡', '怀中睡', '腿上睡'] },
                { act: '写作业', keys: ['作业', '习题', '功课'] },
                { act: '听收音机', keys: ['收音机', '广播'] },
                { act: '吹风扇', keys: ['风扇', '吹风'] },
                { act: '吃汉堡肉', keys: ['汉堡肉', '汉堡'] },
                { act: '吃刨冰', keys: ['刨冰'] },
                { act: '吃冰棍', keys: ['冰棍', '冰棒'] },
                { act: '吃饭', keys: ['吃饭', '晚饭', '午饭', '早饭', '米饭'] },
                { act: '看电视', keys: ['电视'] },
                { act: '洗漱', keys: ['洗漱', '刷牙', '洗脸'] },
                { act: '玄关出门', keys: ['玄关', '出门', '换鞋'] },
                { act: '睡醒', keys: ['睡醒', '醒来', '起床', '刚醒'] },
                { act: '沙发睡觉', keys: ['沙发'] },
                { act: '暖炉休息', keys: ['暖炉'] },
                { act: '做饭', keys: ['做饭', '做菜', '下厨'] },
                { act: '午睡', keys: ['午睡', '午觉'] },
                { act: '晒衣服', keys: ['晒衣服', '晾衣', '晾晒'] }
            ]
        },
        {
            name: '人工海水浴场',
            keys: ['人工海水', '海水浴场'],
            fallback: '闲逛',
            actions: [
                { act: '吃刨冰', keys: ['刨冰'] },
                { act: '游泳', keys: ['游泳', '泳衣', '戏水'] },
                { act: '休息', keys: ['休息', '发呆'] },
                { act: '闲逛', keys: ['闲逛', '散步', '逛'] }
            ]
        },
        {
            name: '海边',
            keys: ['海边', '沙滩', '海岸', '海滩'],
            fallback: '非泳装',
            actions: [
                { act: '泳装', keys: ['泳衣', '泳装', '比基尼'] },
                { act: '赶海', keys: ['赶海', '贝壳', '潮汐', '退潮', '螃蟹'] },
                { act: '非泳装', keys: [] }
            ]
        },
        {
            name: '体育馆',
            keys: ['体育馆'],
            fallback: '休息',
            actions: [
                { act: '休息', keys: ['休息', '发呆'] },
                { act: '闲逛', keys: ['闲逛', '散步'] }
            ]
        },
        {
            name: '古本屋',
            keys: ['古本屋', '书店', '旧书'],
            fallback: '看书',
            actions: [
                { act: '看书', keys: ['看书', '读书'] },
                { act: '休息', keys: ['休息', '发呆'] }
            ]
        },
        {
            name: '商店',
            keys: ['商店', '大熊商店', '大熊', '购物'],
            fallback: '购物',
            actions: [
                { act: '购物', keys: ['购物', '买', '采购'] }
            ]
        },
        {
            name: '杉木林道',
            keys: ['杉木', '林道'],
            fallback: '闲逛',
            actions: [
                { act: '寻宝', keys: ['寻宝', '宝藏', '探险'] },
                { act: '休息', keys: ['休息', '发呆'] },
                { act: '闲逛', keys: ['闲逛', '散步'] }
            ]
        },
        {
            name: '海鸣小学旧址',
            keys: ['小学', '旧址', '校舍'],
            fallback: '闲逛',
            actions: [
                { act: '玩乐', keys: ['玩乐', '玩耍', '捉迷藏', '游戏', '玩'] },
                { act: '休息', keys: ['休息', '发呆'] },
                { act: '闲逛', keys: ['闲逛', '散步'] }
            ]
        },
        {
            name: '海鸣神社',
            keys: ['神社'],
            fallback: '参拜',
            actions: [
                { act: '参拜', keys: ['参拜', '祈愿', '求签', '许愿'] },
                { act: '休息', keys: ['休息', '发呆'] },
                { act: '闲逛', keys: ['闲逛', '散步'] }
            ]
        },
        {
            name: '潮汤',
            keys: ['潮汤', '澡堂'],
            fallback: '泡温泉',
            actions: [
                { act: '泡温泉', keys: ['温泉', '泡汤'] },
                { act: '喝牛奶', keys: ['牛奶'] },
                { act: '清洗身体', keys: ['洗身', '冲洗', '擦身', '洗头', '淋浴'] }
            ]
        },
        {
            name: '炭窑遗址',
            keys: ['炭窑', '遗址'],
            fallback: '闲逛',
            actions: [
                { act: '寻宝', keys: ['寻宝', '宝藏', '探险'] },
                { act: '休息', keys: ['休息', '发呆'] },
                { act: '闲逛', keys: ['闲逛', '散步'] }
            ]
        },
        {
            name: '离岸提',
            keys: ['离岸提', '离岸堤'],
            fallback: '闲逛',
            star: true,
            actions: [
                { act: '看星星', keys: ['星星', '夜空', '观星'] },
                { act: '闲逛', keys: ['闲逛', '散步'] }
            ]
        },
        {
            name: '肉的坂本',
            keys: ['坂本', '肉店', '可乐饼'],
            fallback: '买可乐饼',
            actions: [
                { act: '买可乐饼', keys: ['可乐饼'] },
                { act: '挑猪肉', keys: ['猪肉', '选肉'] }
            ]
        },
        {
            name: '车站',
            keys: ['车站', '站前', '巴士'],
            fallback: '等车',
            actions: [
                { act: '等车', keys: ['等车', '巴士', '候车'] }
            ]
        },
        {
            name: '龙王崎展望台',
            keys: ['展望台', '龙王崎'],
            fallback: '闲逛',
            actions: [
                { act: '钓鱼', keys: ['钓鱼', '钓竿', '鱼竿'] },
                { act: '休息', keys: ['休息', '发呆'] },
                { act: '闲逛', keys: ['闲逛', '散步', '眺望', '看海'] }
            ]
        },
        {
            name: '婚纱',
            special: true,
            keys: ['婚纱', '结婚', '嫁衣', '婚礼', '新娘'],
            fallback: '婚纱',
            actions: [
                { act: '婚纱', keys: [] }
            ]
        },
        {
            name: '怀孕',
            special: true,
            keys: ['怀孕', '孕妇', '身孕'],
            fallback: '怀孕',
            actions: [
                { act: '怀孕', keys: [] }
            ]
        },
        {
            name: '生子',
            special: true,
            keys: ['生子', '宝宝', '婴儿', '出生', '分娩'],
            fallback: '生子',
            actions: [
                { act: '生子', keys: [] }
            ]
        },
        ];
        var UW_GALLERY_HE = {"人工海水浴场|休息":5,"人工海水浴场|吃刨冰":5,"人工海水浴场|游泳":5,"人工海水浴场|闲逛":5,"体育馆|休息":5,"体育馆|闲逛":5,"古本屋|休息":5,"古本屋|看书":5,"商店|购物":5,"婚纱|婚纱":3,"家|一起洗澡":5,"家|做饭":5,"家|午睡":5,"家|吃冰棍":5,"家|吃刨冰":5,"家|吃汉堡肉":5,"家|吃饭":5,"家|吹风扇":5,"家|晒衣服":5,"家|暖炉休息":5,"家|洗漱":5,"家|玄关出门":5,"家|看电视":5,"家|睡醒":5,"家门口|逛街":8,"怀孕|怀孕":3,"杉木林道|休息":5,"杉木林道|寻宝":5,"杉木林道|闲逛":5,"村内|逛街":8,"村口|逛街":8,"海边|泳装":5,"海边|赶海":5,"海边|非泳装":5,"海鸣小学旧址|休息":5,"海鸣小学旧址|玩乐":5,"海鸣小学旧址|闲逛":5,"海鸣神社|休息":5,"海鸣神社|参拜":5,"海鸣神社|闲逛":5,"潮汤|喝牛奶":5,"潮汤|泡温泉":5,"潮汤|清洗身体":5,"炭窑遗址|休息":5,"炭窑遗址|寻宝":5,"炭窑遗址|闲逛":5,"生子|生子":3,"离岸提|看星星":5,"离岸提|闲逛":5,"肉的坂本|买可乐饼":5,"肉的坂本|挑猪肉":5,"车站|等车":5,"龙王崎展望台|休息":5,"龙王崎展望台|钓鱼":5,"龙王崎展望台|闲逛":5};
        function uwGalChar(role){ if(role&&role.indexOf('鹤')!==-1) return '鹤'; if(role&&role.indexOf('澪')!==-1) return '澪'; return ''; }
        var UW_GALLERY_HE_TR={'商店':'大熊商店','离岸提':'离岸堤'};
        function galleryFilesForCh(ch, sc, act){
            if(ch!=='鹤') return galleryFilesFor(sc, act);
            var nm=UW_GALLERY_HE_TR[sc.name]||sc.name;
            var n=UW_GALLERY_HE[sc.name+'|'+act]||0, arr=[];
            for(var i=1;i<=n;i++) arr.push(UW_GALLERY_BASE+encodeURIComponent('鹤_'+nm+'_'+act+'_'+i+'.png'));
            return arr;
        }
        function galleryFilesFor(sc, act) {
            if (sc.files && sc.files[act]) {
                return sc.files[act].map(function(n) { return 'https://raw.githubusercontent.com/roxysl521-droid/bingruo-tu-1/main/' + encodeURIComponent(n); });
            }
            return UW_GALLERY_FILES['澪_' + sc.name + '_' + act] || [];
        }
                /* ================= NSFW分类（bingruo-nsf全量273：7场景x9动作） ================= */
        var UW_NSFW_BASE = 'https://raw.githubusercontent.com/roxysl521-droid/bingruo-nsf/main/';
        var UW_NSFW_SCENES = ['厕所','客厅','房间','浴室','海边','温泉','野外'];
        var UW_NSFW_ACTS = {'乳交':3,'口交':3,'后入位':5,'后入位_高潮':5,'正常位':5,'正常位_高潮':5,'足交':3,'骑乘位':5,'骑乘位_高潮':5};
        var UW_NSFW_FILES = {};
        (function(){
            for (var _si=0; _si<UW_NSFW_SCENES.length; _si++){
                for (var _act in UW_NSFW_ACTS){
                    var _key='澪_'+UW_NSFW_SCENES[_si]+'_'+_act, _arr=[], _n=UW_NSFW_ACTS[_act];
                    for (var _i=1;_i<=_n;_i++) _arr.push(UW_NSFW_BASE+encodeURIComponent('澪_'+UW_NSFW_SCENES[_si]+'_'+_act+'_'+_i+'.png'));
                    UW_NSFW_FILES[_key]=_arr;
                }
            }
        })();
        var UW_NSFW_SCENE_MAP = {'家门口':'野外','村口':'野外','村内':'野外','家':'房间','老宅':'房间','二楼':'房间','房间':'房间','宅':'房间','厨房':'房间','院子':'房间','玄关':'房间','人工海水浴场':'海边','海边':'海边','体育馆':'野外','古本屋':'野外','商店':'野外','杉木林道':'野外','海鸣小学旧址':'野外','海鸣神社':'野外','潮汤':'温泉','炭窑遗址':'野外','离岸提':'海边','肉的坂本':'野外','车站':'野外','龙王崎展望台':'海边','婚纱':'房间','怀孕':'房间','生子':'房间'};
        function uwNsfSceneFor(data){
            var hay=((data&&data.location)||'')+' '+((data&&data.mioLoc)||'')+' '+((data&&data.raw)||'');
            if(/客厅/.test(hay)) return '客厅';
            if(/厕/.test(hay)) return '厕所';
            if(/浴室/.test(hay)) return '浴室';
            if(/温泉/.test(hay)) return '温泉';
            var loc=((data&&data.location)||'')+' '+((data&&data.mioLoc)||'');
            for (var _k in UW_NSFW_SCENE_MAP){ if(loc.indexOf(_k)!==-1) return UW_NSFW_SCENE_MAP[_k]; }
            return '野外';
        }
        function uwNsfFilesHe(sc,act){
            var n=(act==='手交')?((sc==='房间')?3:0):(UW_NSFW_ACTS[act]||0);
            var arr=[];
            for(var i=1;i<=n;i++) arr.push(UW_NSFW_BASE+encodeURIComponent('鹤_'+sc+'_'+act+'_'+i+'.png'));
            return arr;
        }
        function uwNsfUrlFor(data){
            var ch=uwGalChar((data&&data.role)||'');
            if(!ch) ch='澪';
            var sc=uwNsfSceneFor(data);
            var acts=Object.keys(UW_NSFW_ACTS);
            if(ch==='鹤'&&sc==='房间') acts=acts.concat(['手交']);
            var act=acts[Math.floor(Math.random()*acts.length)];
            var arr=(ch==='鹤')?uwNsfFilesHe(sc,act):(UW_NSFW_FILES['澪_'+sc+'_'+act]||[]);
            if(!arr.length) return '';
            return arr[Math.floor(Math.random()*arr.length)];
        }
        function uwNsfFlip(img){
            if(!img) return;
            try{
                var sfw=img.getAttribute('data-sfw')||img.getAttribute('data-gallery-src')||img.src;
                img.setAttribute('data-sfw',sfw);
                var nsfw=img.getAttribute('data-nsfw')||'';
                if(!nsfw) return;
                if(img.dataset&&img.dataset.flipping==='1') return;
                if(img.dataset) img.dataset.flipping='1';
                var showing=img.getAttribute('data-showing')||'sfw';
                var toNsf=(showing==='sfw');
                var wrap=img.closest?img.closest('.gallery-wrapper'):null;
                var badge=wrap?wrap.querySelector('.nsf-badge'):null;
                if(!badge&&wrap){
                    badge=document.createElement('div');
                    badge.className='nsf-badge';
                    var inner0=wrap.querySelector('.gallery-inner');
                    if(inner0) inner0.appendChild(badge);
                    badge.textContent='表 · 点击翻转';
                }
                var reduceMotion=(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
                var prevTransition=img.style?img.style.transition:'';
                function paint(){
                    if(toNsf){
                        img.src=nsfw; img.setAttribute('data-showing','nsfw'); img.title='裏面 · 再点翻回';
                        try{ var _st=uwVaultLoad(); _st.unlocked[uwVaultFileKey(nsfw)]=1; uwVaultSave(_st); }catch(_e){}
                        if(badge){badge.textContent='裏 · 再点翻回';badge.classList.add('nsf-badge--on');}
                    }else{
                        img.src=sfw; img.setAttribute('data-showing','sfw'); img.title='点击翻转';
                        if(badge){badge.textContent='表 · 点击翻转';badge.classList.remove('nsf-badge--on');}
                    }
                    if(!badge){img.title=toNsf?'裏面 · 再点翻回':'点击翻转';}
                }
                if(reduceMotion){ paint(); if(img.dataset) img.dataset.flipping='0'; return; }
                if(!img.style){ paint(); if(img.dataset) img.dataset.flipping='0'; return; }
                img.style.transition='transform .22s ease-in, filter .22s ease-in';
                img.style.transform='rotateY(88deg) scale(.97)';
                img.style.filter='brightness(.82) saturate(.9)';
                setTimeout(function(){
                    paint();
                    img.style.transition='transform .34s cubic-bezier(.2,.75,.25,1.12), filter .3s ease-out';
                    img.style.transform='rotateY(0deg) scale(1)';
                    img.style.filter='';
                    setTimeout(function(){
                        img.style.transition=prevTransition||'';
                        img.style.transform='';
                        if(img.dataset) img.dataset.flipping='0';
                    },360);
                },230);
            }catch(e){ try{ if(img.dataset) img.dataset.flipping='0'; }catch(_){} }
        }
function getGalleryUrl(data) {
            var role = data.role || '';
            var ch = uwGalChar(role);
            if(!ch) return '';
            var hay = (data.raw || '') + '\n' + (data.voice || '') + '\n' + (data.outfit || '');
            var si, sc, ki;
            for (si = 0; si < UW_GALLERY_SCENES.length; si++) {
                sc = UW_GALLERY_SCENES[si];
                if (!sc.special) continue;
                for (ki = 0; ki < sc.keys.length; ki++) {
                    if (hay.indexOf(sc.keys[ki]) !== -1) {
                        var sfiles = galleryFilesForCh(ch, sc, sc.fallback);
                        if (sfiles.length) return sfiles[Math.floor(Math.random() * sfiles.length)];
                    }
                }
            }
            var loc = (data.location || '') + ' ' + (data.mioLoc || '');
            var scene = null;
            for (si = 0; si < UW_GALLERY_SCENES.length; si++) {
                sc = UW_GALLERY_SCENES[si];
                if (sc.special) continue;
                for (ki = 0; ki < sc.keys.length; ki++) {
                    if (loc.indexOf(sc.keys[ki]) !== -1) { scene = sc; break; }
                }
                if (scene) break;
            }
            if (!scene) return '';
            var act = scene.fallback;
            var hit = false;
            for (var ai = 0; ai < scene.actions.length; ai++) {
                var a = scene.actions[ai];
                for (var wi = 0; wi < a.keys.length; wi++) {
                    if (hay.indexOf(a.keys[wi]) !== -1) { act = a.act; hit = true; break; }
                }
                if (hit) break;
            }
            if (!hit && scene.star) {
                var nightHay = (data.time || '') + ' ' + loc;
                if (/夜|晚|凌晨|星空/.test(nightHay) || /(^|\D)(2[0-3]|0\d|0?[0-5])[:时]/.test(nightHay)) act = '看星星';
            }
            var files = galleryFilesForCh(ch, scene, act);
            if(!files.length) files = galleryFilesForCh(ch, scene, scene.fallback);
            if (!files || !files.length) return '';
            return files[Math.floor(Math.random() * files.length)];
        }

        var UW_VAULT_KEY = 'uwVault:bingruo-tu-1:v1';
        var UW_VAULT_PASS = '与病弱妹妹的三十日生活';
        var UW_VAULT_MEM = { unlocked: {}, all: false };
        function uwVaultLoad() {
            try {
                var raw = localStorage.getItem(UW_VAULT_KEY);
                var o = raw ? JSON.parse(raw) : null;
                if (!o || typeof o !== 'object') o = { unlocked: {}, all: false };
                if (!o.unlocked || typeof o.unlocked !== 'object') o.unlocked = {};
                return o;
            } catch (e) { return UW_VAULT_MEM; }
        }
        function uwVaultSave(st) {
            try { localStorage.setItem(UW_VAULT_KEY, JSON.stringify(st)); }
            catch (e) { UW_VAULT_MEM = st; }
        }
        function uwVaultFileKey(url) {
            try {
                var name = decodeURIComponent(String(url).split('/').pop().split('?')[0]);
                if (/^(澪|鹤)_/.test(name)) return name;
            } catch (e) {}
            return String(url);
        }
        function uwVaultFindUrl(fileKey) {
            for (var _k in UW_NSFW_FILES) {
                var _fl = UW_NSFW_FILES[_k];
                for (var _j = 0; _j < _fl.length; _j++) {
                    if (uwVaultFileKey(_fl[_j]) === fileKey) return _fl[_j];
                }
            }
            for (var k in UW_GALLERY_FILES) {
                var fl = UW_GALLERY_FILES[k];
                for (var j = 0; j < fl.length; j++) {
                    if (uwVaultFileKey(fl[j]) === fileKey) return fl[j];
                }
            }
            for (var hk in UW_GALLERY_HE) {
                var hsa = hk.split('|');
                var hnm = UW_GALLERY_HE_TR[hsa[0]]||hsa[0];
                for (var hi=1; hi<=(UW_GALLERY_HE[hk]||0); hi++) {
                    var hu = UW_GALLERY_BASE+encodeURIComponent('鹤_'+hnm+'_'+hsa[1]+'_'+hi+'.png');
                    if (uwVaultFileKey(hu) === fileKey) return hu;
                }
            }
            for (var mk in UW_NSFW_FILES) {
                void mk;
            }
            for (var msc=0; msc<UW_NSFW_SCENES.length; msc++) {
                var mActs = Object.keys(UW_NSFW_ACTS);
                if(UW_NSFW_SCENES[msc]==='房间') mActs = mActs.concat(['手交']);
                for (var mac=0; mac<mActs.length; mac++) {
                    var mu = uwNsfFilesHe(UW_NSFW_SCENES[msc], mActs[mac]);
                    for (var muj=0; muj<mu.length; muj++) {
                        if (uwVaultFileKey(mu[muj]) === fileKey) return mu[muj];
                    }
                }
            }
            return '';
        }
        function uwVaultSceneActs(sc) {
            var acts = [sc.fallback];
            for (var i = 0; i < sc.actions.length; i++) {
                if (acts.indexOf(sc.actions[i].act) === -1) acts.push(sc.actions[i].act);
            }
            return acts;
        }
        var UW_VAULT_CHROW = '<div class="vault-chrow" role="group" aria-label="角色切换"><button type="button" class="vault-ch vault-ch--active" data-ch="mio" onclick="uwVaultCh(this,\'mio\')">澪</button><button type="button" class="vault-ch" data-ch="he" onclick="uwVaultCh(this,\'he\')">鹤</button></div>';
        function uwVaultCh(btn, ch){
            var pane = btn;
            while(pane && !(pane.classList && pane.classList.contains('vault-pane'))) pane = pane.parentElement;
            if(!pane) return;
            var btns = pane.querySelectorAll('.vault-ch');
            for(var i=0;i<btns.length;i++){
                if(btns[i].getAttribute('data-ch')===ch) btns[i].classList.add('vault-ch--active');
                else btns[i].classList.remove('vault-ch--active');
            }
            pane.classList.remove('ch-mio'); pane.classList.remove('ch-he');
            pane.classList.add(ch==='he'?'ch-he':'ch-mio');
        }
        function uwVaultOverlayHtml(st) {
            var total = 0, openCount = 0, groupsHtml = '';
            for (var si = 0; si < UW_GALLERY_SCENES.length; si++) {
                var sc = UW_GALLERY_SCENES[si];
                var acts = uwVaultSceneActs(sc);
                var actsHtml = '', gOpen = 0, gTotal = 0;
                for (var ai = 0; ai < acts.length; ai++) {
                    var files = galleryFilesFor(sc, acts[ai]);
                    var tiles = '', aOpen = 0;
                    for (var vi = 0; vi < files.length; vi++) {
                        var fkey = uwVaultFileKey(files[vi]);
                        if (st.all || st.unlocked[fkey]) {
                            aOpen++;
                            tiles += '<button type="button" class="vault-thumb" data-full="' + files[vi] + '" onclick="uwVaultView(this.getAttribute(\'data-full\'))"><img loading="lazy" decoding="async" src="' + files[vi] + '" alt=""></button>';
                        } else {
                            tiles += '<div class="vault-locked" data-vk="' + fkey + '">🔒</div>';
                        }
                    }
                    gOpen += aOpen; gTotal += files.length;
                    actsHtml += '<button type="button" class="vault-act" data-ch="mio" data-scene="' + sc.name + '" data-act="' + acts[ai] + '" onclick="uwVaultFold(this)"><span>' + acts[ai] + ' · ' + aOpen + '/' + files.length + '</span><span class="vault-arrow">▸</span></button>' +
                        '<div class="vault-act-body" data-ch="mio"><div class="vault-grid">' + tiles + '</div></div>';
                }
                total += gTotal; openCount += gOpen;
                groupsHtml += '<button type="button" class="vault-scene" data-ch="mio" data-scene="' + sc.name + '" onclick="uwVaultFold(this)"><span>' + sc.name + ' · ' + gOpen + '/' + gTotal + '</span><span class="vault-arrow">▸</span></button>' +
                    '<div class="vault-scene-body" data-ch="mio">' + actsHtml + '</div>';
            }
            
            /* NSFW分类：7场景x9动作（与bingruo-nsf仓库一致） */
            var nsfActs = Object.keys(UW_NSFW_ACTS);
            var nsfOpenAll = 0, nsfTotalAll = 0, nsfGroupsHtml = '';
            for (var nsi = 0; nsi < UW_NSFW_SCENES.length; nsi++) {
                var nsName = UW_NSFW_SCENES[nsi];
                var nsActsHtml = '', nsOpen = 0, nsTotal = 0;
                for (var nai = 0; nai < nsfActs.length; nai++) {
                    var nKey = '澪_' + nsName + '_' + nsfActs[nai];
                    var nFiles = UW_NSFW_FILES[nKey] || [];
                    var nTiles = '', nAOpen = 0;
                    for (var nvi = 0; nvi < nFiles.length; nvi++) {
                        var nFkey = uwVaultFileKey(nFiles[nvi]);
                        if (st.all || st.unlocked[nFkey]) {
                            nAOpen++;
                            nTiles += '<button type="button" class="vault-thumb" data-full="' + nFiles[nvi] + '" onclick="uwVaultView(this.getAttribute(\'data-full\'))"><img loading="lazy" decoding="async" src="' + nFiles[nvi] + '" alt=""></button>';
                        } else {
                            nTiles += '<div class="vault-locked" data-vk="' + nFkey + '">🔒</div>';
                        }
                    }
                    nsOpen += nAOpen; nsTotal += nFiles.length;
                    nsActsHtml += '<button type="button" class="vault-act" data-ch="mio" data-scene="NSFW·' + nsName + '" data-act="' + nsfActs[nai] + '" onclick="uwVaultFold(this)"><span>' + nsfActs[nai] + ' · ' + nAOpen + '/' + nFiles.length + '</span><span class="vault-arrow">▸</span></button>' +
                        '<div class="vault-act-body" data-ch="mio"><div class="vault-grid">' + nTiles + '</div></div>';
                }
                nsfOpenAll += nsOpen; nsfTotalAll += nsTotal;
                nsfGroupsHtml += '<button type="button" class="vault-scene vault-scene--nsfw" data-ch="mio" data-scene="NSFW·' + nsName + '" onclick="uwVaultFold(this)"><span>NSFW·' + nsName + ' · ' + nsOpen + '/' + nsTotal + '</span><span class="vault-arrow">▸</span></button>' +
                    '<div class="vault-scene-body" data-ch="mio">' + nsActsHtml + '</div>';
            }
            var sfwOpen = openCount, sfwTotal = total;
            var heNsfOpenAll = 0, heNsfTotalAll = 0, heNsfGroupsHtml = '';
            for (var msi = 0; msi < UW_NSFW_SCENES.length; msi++) {
                var msName = UW_NSFW_SCENES[msi];
                var msActs = Object.keys(UW_NSFW_ACTS);
                if(msName==='房间') msActs = msActs.concat(['手交']);
                var msActsHtml = '', msOpen = 0, msTotal = 0;
                for (var mai = 0; mai < msActs.length; mai++) {
                    var mFiles = uwNsfFilesHe(msName, msActs[mai]);
                    var mTiles = '', mAOpen = 0;
                    for (var mvi = 0; mvi < mFiles.length; mvi++) {
                        var mFkey = uwVaultFileKey(mFiles[mvi]);
                        if (st.all || st.unlocked[mFkey]) { mAOpen++; mTiles += '<button type="button" class="vault-thumb" data-full="' + mFiles[mvi] + '" onclick="uwVaultView(this.getAttribute(\'data-full\'))"><img loading="lazy" decoding="async" src="' + mFiles[mvi] + '" alt=""></button>'; }
                        else { mTiles += '<div class="vault-locked" data-vk="' + mFkey + '">🔒</div>'; }
                    }
                    msOpen += mAOpen; msTotal += mFiles.length;
                    msActsHtml += '<button type="button" class="vault-act" data-ch="he" data-scene="NSFW·' + msName + '" data-act="' + msActs[mai] + '" onclick="uwVaultFold(this)"><span>' + msActs[mai] + ' · ' + mAOpen + '/' + mFiles.length + '</span><span class="vault-arrow">▸</span></button>' +
                        '<div class="vault-act-body" data-ch="he"><div class="vault-grid">' + mTiles + '</div></div>';
                }
                heNsfOpenAll += msOpen; heNsfTotalAll += msTotal;
                heNsfGroupsHtml += '<button type="button" class="vault-scene vault-scene--nsfw" data-ch="he" data-scene="NSFW·' + msName + '" onclick="uwVaultFold(this)"><span>NSFW·' + msName + ' · ' + msOpen + '/' + msTotal + '</span><span class="vault-arrow">▸</span></button>' +
                    '<div class="vault-scene-body" data-ch="he">' + msActsHtml + '</div>';
            }
            nsfGroupsHtml += heNsfGroupsHtml;
            var nsfwGroupsHtml = nsfGroupsHtml; total += nsfTotalAll; openCount += nsfOpenAll;
var repoSet = {};
            for (var rhk in UW_GALLERY_HE) {
                var rsa = rhk.split('|');
                var rnm = UW_GALLERY_HE_TR[rsa[0]]||rsa[0];
                for (var rhi=1; rhi<=(UW_GALLERY_HE[rhk]||0); rhi++) repoSet['鹤_'+rnm+'_'+rsa[1]+'_'+rhi+'.png']=1;
            }
            for (var rsc=0; rsc<UW_NSFW_SCENES.length; rsc++) {
                var rActs = Object.keys(UW_NSFW_ACTS);
                if(UW_NSFW_SCENES[rsc]==='房间') rActs = rActs.concat(['手交']);
                for (var rac=0; rac<rActs.length; rac++) {
                    var rnn = (rActs[rac]==='手交')?((UW_NSFW_SCENES[rsc]==='房间')?3:0):(UW_NSFW_ACTS[rActs[rac]]||0);
                    for (var rni=1; rni<=rnn; rni++) repoSet['鹤_'+UW_NSFW_SCENES[rsc]+'_'+rActs[rac]+'_'+rni+'.png']=1;
                }
            }
            for (var rk in UW_GALLERY_FILES) {
                var rfl = UW_GALLERY_FILES[rk];
                for (var rj = 0; rj < rfl.length; rj++) repoSet[uwVaultFileKey(rfl[rj])] = 1;
            }
            for (var nk in UW_NSFW_FILES) {
                var nfl = UW_NSFW_FILES[nk];
                for (var nj = 0; nj < nfl.length; nj++) repoSet[uwVaultFileKey(nfl[nj])] = 1;
            }
            var extraTiles = '', extraCount = 0;
            for (var ek in st.unlocked) {
                if (!repoSet[ek] && ek.indexOf('http') === 0) {
                    extraCount++;
                    extraTiles += '<button type="button" class="vault-thumb" data-full="' + ek + '" onclick="uwVaultView(this.getAttribute(\'data-full\'))"><img loading="lazy" decoding="async" src="' + ek + '" alt=""></button>';
                }
            }
            var heSfwOpen = 0, heSfwTotal = 0, heSfwGroupsHtml = '';
            for (var hsi = 0; hsi < UW_GALLERY_SCENES.length; hsi++) {
                var hsc = UW_GALLERY_SCENES[hsi];
                var hacts = uwVaultSceneActs(hsc);
                var hActsHtml = '', hOpen = 0, hTotal = 0;
                for (var hai = 0; hai < hacts.length; hai++) {
                    var hfiles = galleryFilesForCh('鹤', hsc, hacts[hai]);
                    var hTiles = '', hAOpen = 0;
                    for (var hvi = 0; hvi < hfiles.length; hvi++) {
                        var hFkey = uwVaultFileKey(hfiles[hvi]);
                        if (st.all || st.unlocked[hFkey]) { hAOpen++; hTiles += '<button type="button" class="vault-thumb" data-full="' + hfiles[hvi] + '" onclick="uwVaultView(this.getAttribute(\'data-full\'))"><img loading="lazy" decoding="async" src="' + hfiles[hvi] + '" alt=""></button>'; }
                        else { hTiles += '<div class="vault-locked" data-vk="' + hFkey + '">🔒</div>'; }
                    }
                    hOpen += hAOpen; hTotal += hfiles.length;
                    hActsHtml += '<button type="button" class="vault-act" data-ch="he" data-scene="' + hsc.name + '" data-act="' + hacts[hai] + '" onclick="uwVaultFold(this)"><span>' + hacts[hai] + ' · ' + hAOpen + '/' + hfiles.length + '</span><span class="vault-arrow">▸</span></button>' +
                        '<div class="vault-act-body" data-ch="he"><div class="vault-grid">' + hTiles + '</div></div>';
                }
                heSfwOpen += hOpen; heSfwTotal += hTotal;
                heSfwGroupsHtml += '<button type="button" class="vault-scene" data-ch="he" data-scene="' + hsc.name + '" onclick="uwVaultFold(this)"><span>' + hsc.name + ' · ' + hOpen + '/' + hTotal + '</span><span class="vault-arrow">▸</span></button>' +
                    '<div class="vault-scene-body" data-ch="he">' + hActsHtml + '</div>';
            }
            groupsHtml += heSfwGroupsHtml;
            groupsHtml = UW_VAULT_CHROW + groupsHtml;
            nsfwGroupsHtml = UW_VAULT_CHROW + nsfwGroupsHtml;
            if (extraTiles) {
                groupsHtml += '<button type="button" class="vault-scene" data-scene="extra" onclick="uwVaultFold(this)"><span>特别收录 · ' + extraCount + '</span><span class="vault-arrow">▸</span></button>' +
                    '<div class="vault-scene-body"><div class="vault-grid">' + extraTiles + '</div></div>';
            }
            return '<div class="vault-overlay" onclick="if(event.target===this)uwVaultClose(this)">' +
                '<div class="vault-panel" role="dialog" aria-label="画廊仓库">' +
                    '<div class="vault-panel-head">' +
                        '<span class="vault-title">画廊仓库</span>' +
                        '<span class="vault-count">' + openCount + ' / ' + total + ' 已解锁</span>' +
                        '<button type="button" class="vault-close" onclick="uwVaultClose(this)">×</button>' +
                    '</div>' +
                    '<div class="vault-passrow">' +
                        '<input type="text" class="vault-pass" placeholder="输入密码，一次性解锁全部">' +
                        '<button type="button" class="vault-go" onclick="uwVaultUnlockAll(this)">解锁全部</button>' +
                    '</div>' +
                    '<div class="vault-tabs" role="tablist">' +
                        '<button type="button" class="vault-tab vault-tab--active" data-pane="sfw" onclick="uwVaultTab(this)">普通 · ' + (sfwOpen+heSfwOpen) + '/' + (sfwTotal+heSfwTotal) + '</button>' +
                        '<button type="button" class="vault-tab vault-tab--nsfw" data-pane="nsfw" onclick="uwVaultTab(this)">NSFW · ' + (nsfOpenAll+heNsfOpenAll) + '/' + (nsfTotalAll+heNsfTotalAll) + '</button>' +
                    '</div>' +
                    '<div class="vault-groups vault-pane vault-pane--open ch-mio" data-pane="sfw">' + groupsHtml + '</div>' +
                    '<div class="vault-groups vault-pane ch-mio" data-pane="nsfw">' + nsfwGroupsHtml + '</div>'  +
                '</div>' +
            '</div>';
        }
        function uwVaultTab(btn){
            var bar=btn.parentElement, panel=bar;
            while(panel && !(panel.classList && panel.classList.contains('vault-panel'))) panel=panel.parentElement;
            if(!panel) return;
            var tabs=bar.querySelectorAll('.vault-tab');
            for(var i=0;i<tabs.length;i++) tabs[i].classList.remove('vault-tab--active');
            btn.classList.add('vault-tab--active');
            var panes=panel.querySelectorAll('.vault-pane');
            for(var k=0;k<panes.length;k++){
                if(panes[k].getAttribute('data-pane')===btn.getAttribute('data-pane')) panes[k].classList.add('vault-pane--open');
                else panes[k].classList.remove('vault-pane--open');
            }
        }
        function uwVaultFold(btn) {
            var body = btn.nextElementSibling;
            var arrow = btn.querySelector('.vault-arrow');
            if (!body) return;
            var isOpen = body.classList.contains('vault-act-body')
                ? body.classList.toggle('vault-act-body--open')
                : body.classList.toggle('vault-scene-body--open');
            if (arrow) arrow.textContent = isOpen ? '▾' : '▸';
        }
        var uwViewerEl = null;
        function uwVaultView(url) {
            if (!url) return;
            var bd = uwViewerEl;
            if (!bd) {
                bd = document.createElement('div');
                bd.className = 'uw-viewer';
                bd.setAttribute('role', 'dialog');
                bd.setAttribute('aria-label', '图片查看');
                var img = document.createElement('img');
                img.className = 'uw-viewer-img';
                img.alt = ''; img.decoding = 'async';
                img.addEventListener('click', function(e) { e.stopPropagation(); });
                var close = document.createElement('button');
                close.type = 'button'; close.className = 'uw-viewer-close'; close.setAttribute('aria-label', '关闭');
                close.textContent = '×';
                close.addEventListener('click', function(e) { e.stopPropagation(); uwVaultCloseView(); });
                bd.appendChild(img); bd.appendChild(close);
                bd.addEventListener('click', function(e) { if (e.target === bd) uwVaultCloseView(); });
                document.body.appendChild(bd);
                uwViewerEl = bd;
            }
            var im = bd.querySelector('.uw-viewer-img');
            if (im) im.src = url;
            bd.classList.add('uw-viewer--open');
        }
        function uwVaultCloseView() {
            if (!uwViewerEl) return;
            uwViewerEl.classList.remove('uw-viewer--open');
            var im = uwViewerEl.querySelector('.uw-viewer-img');
            if (im) im.removeAttribute('src');
        }
                function uwVaultOpen(btn) {
            var card = btn;
            while (card && !(card.classList && card.classList.contains('card'))) card = card.parentElement;
            if (!card) return;
            var ov = card.querySelector('.vault-overlay');
            if (ov) ov.classList.add('vault-overlay--open');
            card.classList.add('vault-open');
        }
        function uwVaultClose(el) {
            var ov = el.classList && el.classList.contains('vault-overlay') ? el : null;
            if (!ov) {
                var node = el;
                while (node && !(node.classList && node.classList.contains('vault-overlay'))) node = node.parentElement;
                ov = node;
            }
            if (ov) ov.classList.remove('vault-overlay--open');
            var c2 = ov;
            while (c2 && !(c2.classList && c2.classList.contains('card'))) c2 = c2.parentElement;
            if (c2) c2.classList.remove('vault-open');
        }
        function uwVaultUnlockAll(btn) {
            var root = btn;
            while (root && !(root.classList && root.classList.contains('vault-overlay'))) root = root.parentElement;
            if (!root) return;
            var input = root.querySelector('.vault-pass');
            if (!input || input.value !== UW_VAULT_PASS) {
                var old = btn.textContent;
                btn.textContent = '密码不对';
                setTimeout(function() { btn.textContent = old; }, 1200);
                return;
            }
            var st = uwVaultLoad();
            st.all = true;
            uwVaultSave(st);
            var tiles = root.querySelectorAll('.vault-locked');
            for (var i = 0; i < tiles.length; i++) {
                (function(tile) {
                    var url = uwVaultFindUrl(tile.getAttribute('data-vk'));
                    if (!url) return;
                    var a = document.createElement('button');
                    a.type = 'button';
                    a.className = 'vault-thumb';
                    a.setAttribute('data-full', url);
                    a.addEventListener('click', function() { uwVaultView(url); });
                    var img = document.createElement('img');
                    img.loading = 'lazy'; img.decoding = 'async'; img.alt = ''; img.src = url;
                    a.appendChild(img);
                    tile.parentElement.replaceChild(a, tile);
                })(tiles[i]);
            }
            var refreshFold = function(foldBtn, grid) {
                var thumbs = grid.querySelectorAll('.vault-thumb').length;
                var total = grid.querySelectorAll('.vault-thumb, .vault-locked').length;
                var label = foldBtn.querySelector('span');
                var base = foldBtn.getAttribute('data-act') || foldBtn.getAttribute('data-scene');
                if (label && base && base !== 'extra') label.textContent = base + ' · ' + thumbs + '/' + total;
            };
            var acts = root.querySelectorAll('.vault-act');
            for (var ai = 0; ai < acts.length; ai++) {
                var abody = acts[ai].nextElementSibling;
                if (abody) refreshFold(acts[ai], abody);
            }
            var scenes = root.querySelectorAll('.vault-scene');
            for (var si = 0; si < scenes.length; si++) {
                var sbody = scenes[si].nextElementSibling;
                if (sbody && scenes[si].getAttribute('data-scene') !== 'extra') refreshFold(scenes[si], sbody);
            }
            var total = 0;
            for (var tk in UW_GALLERY_FILES) total += UW_GALLERY_FILES[tk].length;
            var count = root.querySelector('.vault-count');
            if (count) count.textContent = total + ' / ' + total + ' 已解锁';
        }
        function hasValidImage(urlStr) {
            if (!urlStr || urlStr === '无' || urlStr === '空' || urlStr.indexOf('http') === -1) {
                return false;
            }
            return true;
        }

        /* ================= 纯SVG图标库 ================= */
        const icons = {
            time: '<svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
            location: '<svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
            weather: '<svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>',

            /* 澪的装饰：四芒星（清冷冰晶） */
            mioStar: '<svg class="star-deco" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10Z"/></svg>',
            mioWaterDrop: '<svg class="outfit-bg-deco" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 4.2c3.11 2.31 4.34 5.37 4.34 8.11C22 20.52 17.52 22 12 22C6.48 22 2 20.52 2 15c0-2.74 1.23-5.8 4.34-8.11L12 2.69z"/></svg>',
            mioSnowflake: '<svg class="voice-bg-deco" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',

            /* 鹤的装饰：五角星（暖阳元气） */
            tsuruStar: '<svg class="star-deco" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
            tsuruSun: '<svg class="outfit-bg-deco" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
            tsuruWave: '<svg class="voice-bg-deco" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M2 12c2.67 0 4-3 8-3s5.33 3 8 3 4-3 4-3M2 18c2.67 0 4-3 8-3s5.33 3 8 3 4-3 4-3"/></svg>'
        };

        /* ========== 渲染界面 ========== */
        function renderPage(data) {
            var themeClass = getThemeClass(data.role);
            var avatarText = getAvatarText(data.role);
            var avatarUrl = getAvatarUrl(data.role || '');
            var avatarImgHtml = avatarUrl ? '<img class="avatar-img" data-avatar-src="' + avatarUrl + '" alt="" decoding="async" onerror="this.remove()">' : '';

            var galleryHtml = '';
            var autoGalleryUrl = getGalleryUrl(data);
            var autoNsfwUrl = uwNsfUrlFor(data);
            var vaultState = uwVaultLoad();
            if (autoGalleryUrl) { vaultState.unlocked[uwVaultFileKey(autoGalleryUrl)] = 1; uwVaultSave(vaultState); }
            if (hasValidImage(data.imgUrl)) { vaultState.unlocked[uwVaultFileKey(data.imgUrl)] = 1; uwVaultSave(vaultState); }
            var vaultHtml = uwVaultOverlayHtml(vaultState);
            if (hasValidImage(data.imgUrl)) {
                galleryHtml = '<img src="' + data.imgUrl + '" class="gallery-img" alt="" decoding="async" data-sfw="' + data.imgUrl + '" data-nsfw="' + autoNsfwUrl + '" data-showing="sfw" title="点击翻转" style="cursor:pointer" onclick="uwNsfFlip(this)">';
            } else if (autoGalleryUrl) {
                galleryHtml = '<img class="gallery-img" data-gallery-src="' + autoGalleryUrl + '" data-sfw="' + autoGalleryUrl + '" data-nsfw="' + autoNsfwUrl + '" data-showing="sfw" title="点击翻转" style="cursor:pointer" onclick="uwNsfFlip(this)" onerror="if(!this.dataset.fb){this.dataset.fb=\'1\';var d=document.createElement(\'div\');d.className=\'gallery-placeholder\';d.textContent=\'IMAGE PENDING\';this.replaceWith(d);}">';
            } else {
                galleryHtml = '<div class="gallery-placeholder">IMAGE PENDING</div>';
            }

            /* 根据角色应用差异化SVG装饰 */
            var isMio = themeClass === 'theme-mio';
            var mainStarSvg = isMio ? icons.mioStar : icons.tsuruStar;
            var outfitBgSvg = isMio ? icons.mioWaterDrop : icons.tsuruSun;
            var voiceBgSvg = isMio ? icons.mioSnowflake : icons.tsuruWave;

            var html =
                '<div class="card ' + themeClass + '">' +
                    '<div class="card-bg"></div>' +

                    /* 第一区：大头像与名字 */
                    '<div class="header-section">' +
                        '<div class="avatar-wrap">' +
                            '<div class="avatar">' + avatarText + avatarImgHtml + '</div>' +
                        '</div>' +
                        '<div class="name-info">' +
                            mainStarSvg +
                            '<div class="cn-name">' + (data.role || '') + '</div>' +
                            '<div class="jp-name">' + (data.jpName || '') + '</div>' +
                        '</div>' +
                    '</div>' +

                    /* 第二区：SVG元气便签标签 */
                    '<div class="meta-section">' +
                        '<div class="meta-tag">' + icons.time + (data.time || '') + '</div>' +
                        '<div class="meta-tag">' + icons.location + (data.location || '') + '</div>' +
                        '<div class="meta-tag">' + icons.weather + (data.weather || '') + '</div>' +
                    '</div>' +

                    /* 第三区：手账风打扮描述 (含主题水印) */
                    '<div class="outfit-section">' +
                        outfitBgSvg +
                        '<div class="section-title">TODAY\'S OUTFIT</div>' +
                        '<div class="outfit-text">' + (data.outfit || '') + '</div>' +
                    '</div>' +

                    /* 第四区：漫画气泡内心话 (含主题水印) */
                    '<div class="voice-section">' +
                        voiceBgSvg +
                        '<div class="voice-text">' + (data.voice || '') + '</div>' +
                    '</div>' +

                    /* 5.5区：町内案内图（交互地图，由 renderMap 填充） */
                    '<div class="map-section uw-map"></div>' +

                    /* 第五区：最底部的插图画框 */
                    '<div class="gallery-wrapper">' +
                        '<div class="tape-deco"></div>' +
                        '<div class="gallery-inner">' +
                            galleryHtml +
                        '</div>' +
                    '</div>' +

                    /* 第七区：画廊仓库（输出解锁 + 密码全开） */
                    vaultHtml +

                    /* 第六区：Q版小人（uwInitQ 填充） */
                    '<div class="q-widget uw-q"></div>' +
                    '<button type="button" class="vault-link" onclick="uwVaultOpen(this)">🗂 画廊仓库</button>' +

                '</div>';

            document.getElementById('content').innerHTML = html;
            /* 头像预加载：内存解码完成后再上屏，不显示半解码 mush */
            (function() {
                var avs = document.querySelectorAll('.avatar-img[data-avatar-src], .gallery-img[data-gallery-src]');
                for (var ai = 0; ai < avs.length; ai++) {
                    (function(el) {
                        var url = el.getAttribute('data-avatar-src') || el.getAttribute('data-gallery-src');
                        if (!url) return;
                        try {
                            var im = new Image();
                            im.onload = function() { el.src = url; };
                            im.src = url;
                        } catch (e) { el.src = url; }
                    })(avs[ai]);
                }
            })();
            renderMap(data);
            uwInitQ(data);
        }

        /* ================= 町内案内图（海鸣町交互地图） ================= */
        var UW_MAP = {
            img: 'https://raw.githubusercontent.com/roxysl521-droid/bingruo-li-hui/main/map_1000_q80.jpg',
            travelTemplate: '（我动身前往「{name}」。）',
            chars: [
                { name: '澪', color: '#0284c7', field: 'mioLoc',   img: 'https://raw.githubusercontent.com/roxysl521-droid/bingruo-li-hui/main/avatar_mio.jpg' },
                { name: '鹤', color: '#ea580c', field: 'tsuruLoc', img: 'https://raw.githubusercontent.com/roxysl521-droid/bingruo-li-hui/main/avatar_tsuru.jpg' }
            ],
            cats: {
                home:   { legend: '住处', color: '#f59e0b' },
                life:   { legend: '店铺', color: '#0ea5e9' },
                nature: { legend: '自然', color: '#16a34a' },
                lore:   { legend: '怪谈', color: '#9333ea' },
                road:   { legend: '交通', color: '#64748b' }
            },
            pins: [
                { id: 'home',   name: '潮见家老宅',       cat: 'home',   x: 62.5, y: 23.6, kw: ['老宅', '潮见家', '家', '澪的房间', '姐姐的房间', '我的房间', '客厅', '厨房', '玄关', '庭院'],
                  intro: '昭和木造二层老宅，院里种着向日葵和紫苏。澪房间的窗，望得见日本海。' },
                { id: 'wugen',  name: '无根苔·石祠',      cat: 'lore',   x: 64.9, y: 9.4,  kw: ['石祠', '无根苔'],
                  intro: '拜殿旁的青苔石祠，供着用海难者头发烧制的替身人偶。' },
                { id: 'shrine', name: '海鸣神社',         cat: 'lore',   x: 58, y: 10,  kw: ['神社'],
                  intro: '朱红褪色的拜殿与苔痕石灯笼。逆潮之夜，会举行镇魂的古祭。' },
                { id: 'bus',    name: '神社前巴士站',     cat: 'road',   x: 57.1, y: 19, kw: ['巴士', '车站', '公交'],
                  intro: '「矶波号」始发站。每日仅三班：7:00 / 13:30 / 17:10。' },
                { id: 'school', name: '海鸣小学旧址',     cat: 'lore',   x: 78.9, y: 17.2, kw: ['小学', '校舍', '操场'],
                  intro: '废校多年，操场留着锈蚀的爬杆。黄昏时分，不要直视二楼窗户。' },
                { id: 'gym',    name: '旧体育馆',         cat: 'life',   x: 84.9, y: 20.1, kw: ['体育馆'],
                  intro: '盆踊大会的会场，钥匙寄存在社务所。平时大门紧锁。' },
                { id: 'forest', name: '道后山林',         cat: 'nature', x: 92.1, y: 17, kw: ['道后山林', '山林', '深山'],
                  intro: '镇子背靠的深山，山的那边还是山。雨后偶有山猪脚印。' },
                { id: 'sugi',   name: '杉木林道',         cat: 'nature', x: 83.7, y: 36.2, kw: ['杉木', '林道'],
                  intro: '只容步行与自行车的林间小径。走到高处，手机就没有信号了。' },
                { id: 'kiln',   name: '废弃炭窑',         cat: 'lore',   x: 91.8, y: 50, kw: ['炭窑'],
                  intro: '半埋进土坡的砖窑，孩子们的秘密基地。但绝不能在里面过夜。' },
                { id: 'takai',  name: '高井堤',           cat: 'lore',   x: 8.2,  y: 31.3, kw: ['高井堤'],
                  intro: '北面的旧堤坝。退潮时白浪翻涌，像龙在吐息——「龙王吐息」。' },
                { id: 'pier',   name: '主码头防波堤',     cat: 'lore',   x: 12.7, y: 44.7, kw: ['防波堤', '码头'],
                  intro: '风很大的长堤，海鸥蹲在堤灯上等渔船。退潮时能翻到螃蟹。' },
                { id: 'port',   name: '海鸣町港',         cat: 'nature', x: 24, y: 48, kw: ['港口', '渔港', '港'],
                  intro: '渔船与碎冰气味的港湾。清晨六点，早市准时开秤。' },
                { id: 'gyokyo', name: '渔协事务所',       cat: 'life',   x: 32.6, y: 45.6, kw: ['渔协', '冰室', '早市'],
                  intro: '两层白色小楼。一楼是飘着碎冰味的冰室，二楼能望见林道入口。' },
                { id: 'sakuba', name: '水产加工小作坊',   cat: 'life',   x: 31.3, y: 52.4, kw: ['水产', '作坊', '加工'],
                  intro: '晾满鱼干的半开放棚屋。佃煮的甜香，能飘进隔壁理发厅。' },
                { id: 'beach',  name: '人工海水浴场',     cat: 'nature', x: 33.5, y: 61.1, kw: ['海水浴场', '人工浴场'],
                  intro: '消波块围出的浅滩，七月末才开放。刨冰机是手摇的那种。' },
                { id: 'kuma',   name: '大熊商店',         cat: 'life',   x: 44.3, y: 40, kw: ['大熊', '杂货'],
                  intro: '村里唯一的杂货铺，门口长椅是棋局圣地。夏季限定海盐苏打冰棒。' },
                { id: 'saka',   name: '肉的坂本',         cat: 'life',   x: 56.4, y: 43.7, kw: ['坂本', '肉店', '肉铺', '炸肉饼'],
                  intro: '炸肉饼的香气飘半条街。下午三点出锅，孩子们扒着玻璃等。' },
                { id: 'furu',   name: '古本屋',           cat: 'life',   x: 48.9, y: 50.7, kw: ['古本', '旧书店'],
                  intro: '门面极窄、纵深惊人的旧书店。角落里收着海鸣町的地方志。' },
                { id: 'barber', name: '浪花理发厅',       cat: 'life',   x: 55.9, y: 54.1, kw: ['理发'],
                  intro: '红白蓝转灯慢慢转，演歌伴着推子声。价格十几年没涨过。' },
                { id: 'post',   name: '邮局',             cat: 'life',   x: 49.5, y: 57.4, kw: ['邮局'],
                  intro: '门口的红色邮筒很显眼。汇款单上写满留守人家的牵挂。' },
                { id: 'yu',     name: '潮汤',             cat: 'life',   x: 61.4, y: 60.9, kw: ['潮汤', '公共浴场'],
                  intro: '傍晚六点后最挤的浴场。泡完澡的冰咖啡牛奶，是村里的规矩。' },
                { id: 'clinic', name: '诊疗所',           cat: 'life',   x: 55.8, y: 61.7, kw: ['诊疗', '诊所', '医院'],
                  intro: '老医生用圆珠笔在纸袋上写用法。澪的药，要托巴士从市里带回。' },
                { id: 'tenbo',  name: '龙王崎展望台',     cat: 'nature', x: 65.2, y: 80.3, kw: ['展望台'],
                  intro: '日落与海钓的胜地，栏杆上挂满祈愿绘马。夜里能看银河。' },
                { id: 'ryuo',   name: '龙王崎',           cat: 'nature', x: 56.8, y: 88.2, kw: ['龙王崎'],
                  intro: '镇子的尽头。崖下的大海，传说沉睡着海的怨念。' },
                { id: 'kaizo',  name: '活人冢海蚀洞',     cat: 'lore',   x: 80.9, y: 87.3, kw: ['海蚀洞', '活人冢'],
                  intro: '退大潮才露出的禁地海蚀洞。满月夜，不要回应海上的呼唤。' },
                { id: 'kendo',  name: '县道48号',         cat: 'road',   x: 66.4, y: 68.2, kw: ['县道', '公路', '矶波市'],
                  intro: '唯一对外的公路，往矶波市约六十公里。台风天常因落石中断。' }
            ]
        };

        function uwGetCanvas() {
            return document.querySelector('.uw-map-canvas');
        }

        function uwMatchLocation(str) {
            if (!str) return -1;
            for (var i = 0; i < UW_MAP.pins.length; i++) {
                var kws = UW_MAP.pins[i].kw;
                for (var k = 0; k < kws.length; k++) {
                    if (str.indexOf(kws[k]) !== -1) return i;
                }
            }
            return -1;
        }

        var uwToastEl = null;
        var uwToastTimer = 0;
        function uwToast(msg, isErr) {
            if (!uwToastEl) {
                uwToastEl = document.createElement('div');
                uwToastEl.className = 'uw-toast';
                document.body.appendChild(uwToastEl);
            }
            uwToastEl.textContent = msg;
            uwToastEl.className = 'uw-toast uw-toast--show' + (isErr ? ' uw-toast--err' : '');
            clearTimeout(uwToastTimer);
            uwToastTimer = setTimeout(function() { uwToastEl.className = 'uw-toast'; }, 2600);
        }

        var uwBusy = false;
        function uwTravel(pinData) {
            if (uwBusy) return;
            if (typeof createChatMessages !== 'function' || typeof triggerSlash !== 'function') {
                uwToast('需要 Tavern Helper 环境才能前往该地点', true);
                return;
            }
            uwBusy = true;
            uwToast('正在前往「' + pinData.name + '」…');
            Promise.resolve()
                .then(function() {
                    return createChatMessages([{ role: 'user', message: UW_MAP.travelTemplate.replace('{name}', pinData.name) }]);
                })
                .then(function() { return triggerSlash('/trigger'); })
                .then(function() { setTimeout(function() { uwBusy = false; }, 1200); })
                .catch(function(err) {
                    uwBusy = false;
                    uwToast('发送失败：' + ((err && err.message) || err || '未知错误'), true);
                });
        }

        function uwOpenTip(pinData, pinEl) {
            var canvas = uwGetCanvas();
            var tip = canvas && canvas.querySelector('.uw-tip');
            if (!tip) return;
            var cat = UW_MAP.cats[pinData.cat];
            tip.innerHTML = '';
            tip.style.setProperty('--uw-pin-color', cat.color);

            var head = document.createElement('div');
            head.className = 'uw-tip-head';
            var chip = document.createElement('span');
            chip.className = 'uw-tip-cat';
            chip.textContent = cat.legend;
            var nameEl = document.createElement('span');
            nameEl.className = 'uw-tip-name';
            nameEl.textContent = pinData.name;
            head.appendChild(chip);
            head.appendChild(nameEl);

            var intro = document.createElement('div');
            intro.className = 'uw-tip-intro';
            intro.textContent = pinData.intro;

            var go = document.createElement('button');
            go.type = 'button';
            go.className = 'uw-tip-go';
            go.textContent = '前往此处 ▸';
            go.addEventListener('click', function(ev) {
                ev.stopPropagation();
                uwTravel(pinData);
            });

            tip.appendChild(head);
            tip.appendChild(intro);
            tip.appendChild(go);

            tip.style.left = pinData.x + '%';
            tip.style.top = pinData.y + '%';

            var posClass = '';
            if (pinData.x < 14) posClass += ' uw-tip--l';
            if (pinData.x > 86) posClass += ' uw-tip--r';
            if (pinData.y < 30) posClass += ' uw-tip--below';
            tip.className = 'uw-tip uw-tip--show' + posClass;

            var canvasEl = canvas.querySelectorAll('.uw-pin--sel');
            for (var i = 0; i < canvasEl.length; i++) canvasEl[i].classList.remove('uw-pin--sel');
            pinEl.classList.add('uw-pin--sel');
        }

        function uwCloseTip() {
            var canvas = uwGetCanvas();
            if (!canvas) return;
            var tip = canvas.querySelector('.uw-tip');
            if (tip) tip.className = 'uw-tip';
            var sel = canvas.querySelectorAll('.uw-pin--sel');
            for (var i = 0; i < sel.length; i++) sel[i].classList.remove('uw-pin--sel');
        }

        /* ================= 大图灯箱 ================= */
        var UW_LB_ZOOMS = [1, 1.5, 2, 2.75, 3.5];
        var uwLbZoomIdx = 0;
        var uwSuppressClick = false;
        var uwLbPrevParent = null;
        var uwLbNextSibling = null;
        var uwLbOpener = null;

        function uwApplyLbZoom() {
            var viewport = document.querySelector('.uw-lb-viewport');
            if (!viewport) return;
            var stage = viewport.querySelector('.uw-lb-stage');
            if (stage) stage.style.width = Math.round(viewport.clientWidth * UW_LB_ZOOMS[uwLbZoomIdx]) + 'px';
            var label = document.querySelector('.uw-lb-zoom');
            if (label) label.textContent = Math.round(UW_LB_ZOOMS[uwLbZoomIdx] * 100) + '%';
            var minus = document.querySelector('.uw-lb-minus');
            var plus = document.querySelector('.uw-lb-plus');
            if (minus) minus.disabled = uwLbZoomIdx <= 0;
            if (plus) plus.disabled = uwLbZoomIdx >= UW_LB_ZOOMS.length - 1;
        }

        function uwCloseLightbox() {
            var lb = document.querySelector('.uw-lightbox');
            if (!lb) return;
            var canvas = uwGetCanvas();
            if (canvas && uwLbPrevParent) {
                uwLbPrevParent.insertBefore(canvas, uwLbNextSibling);
            }
            document.removeEventListener('keydown', uwLbOnKey);
            window.removeEventListener('resize', uwLbOnResize);
            lb.remove();
            if (uwLbOpener && uwLbOpener.focus) uwLbOpener.focus();
        }

        function uwLbOnKey(e) {
            if (e.key === 'Escape') uwCloseLightbox();
        }

        function uwLbOnResize() {
            uwApplyLbZoom();
            var c = uwGetCanvas();
            if (c && c.uwFixH) c.uwFixH();
        }

        function uwOpenLightbox() {
            if (document.querySelector('.uw-lightbox')) return;
            var canvas = uwGetCanvas();
            if (!canvas) return;

            uwLbOpener = document.activeElement;
            uwLbPrevParent = canvas.parentNode;
            uwLbNextSibling = canvas.nextSibling;

            var themeEl = canvas.closest ? canvas.closest('.theme-mio, .theme-tsuru') : null;
            var themeClass = themeEl ? (themeEl.classList.contains('theme-tsuru') ? 'theme-tsuru' : 'theme-mio') : 'theme-mio';

            var lb = document.createElement('div');
            lb.className = 'uw-lightbox ' + themeClass;
            lb.setAttribute('role', 'dialog');
            lb.setAttribute('aria-label', '海鸣町大地图');

            var bar = document.createElement('div');
            bar.className = 'uw-lb-bar';
            var title = document.createElement('span');
            title.className = 'uw-lb-bar-title';
            title.textContent = '海鸣町 · 町内案内图';
            var minus = document.createElement('button');
            minus.type = 'button';
            minus.className = 'uw-lb-btn uw-lb-minus';
            minus.setAttribute('aria-label', '缩小');
            minus.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
            var zoomLabel = document.createElement('span');
            zoomLabel.className = 'uw-lb-btn uw-lb-zoom';
            zoomLabel.textContent = '100%';
            var plus = document.createElement('button');
            plus.type = 'button';
            plus.className = 'uw-lb-btn uw-lb-plus';
            plus.setAttribute('aria-label', '放大');
            plus.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line><line x1="12" y1="5" x2="12" y2="19"></line></svg>';
            var closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'uw-lb-btn uw-lb-close';
            closeBtn.setAttribute('aria-label', '关闭大图');
            closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>';
            minus.addEventListener('click', function() { if (uwLbZoomIdx > 0) { uwLbZoomIdx--; uwApplyLbZoom(); } });
            plus.addEventListener('click', function() { if (uwLbZoomIdx < UW_LB_ZOOMS.length - 1) { uwLbZoomIdx++; uwApplyLbZoom(); } });
            closeBtn.addEventListener('click', uwCloseLightbox);
            bar.appendChild(title);
            bar.appendChild(minus);
            bar.appendChild(zoomLabel);
            bar.appendChild(plus);
            bar.appendChild(closeBtn);

            var viewport = document.createElement('div');
            viewport.className = 'uw-lb-viewport';
            var stage = document.createElement('div');
            stage.className = 'uw-lb-stage';
            stage.addEventListener('click', function(e) { e.stopPropagation(); });

            stage.appendChild(canvas);
            viewport.appendChild(stage);
            lb.appendChild(bar);
            lb.appendChild(viewport);

            lb.addEventListener('click', function(e) { if (e.target === lb) uwCloseLightbox(); });
            document.addEventListener('keydown', uwLbOnKey);
            window.addEventListener('resize', uwLbOnResize);

            /* 鼠标拖拽平移（触屏用原生滚动） */
            viewport.addEventListener('pointerdown', function(e) {
                if (e.pointerType !== 'mouse' || e.button !== 0) return;
                var sx = e.clientX, sy = e.clientY;
                var sl = viewport.scrollLeft, st = viewport.scrollTop;
                var moved = false;
                function onMove(ev) {
                    var dx = ev.clientX - sx, dy = ev.clientY - sy;
                    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;
                    viewport.scrollLeft = sl - dx;
                    viewport.scrollTop = st - dy;
                }
                function onUp() {
                    viewport.removeEventListener('pointermove', onMove);
                    viewport.removeEventListener('pointerup', onUp);
                    viewport.classList.remove('uw-lb-grabbing');
                    if (moved) {
                        uwSuppressClick = true;
                        setTimeout(function() { uwSuppressClick = false; }, 0);
                    }
                }
                viewport.addEventListener('pointermove', onMove);
                viewport.addEventListener('pointerup', onUp);
                viewport.classList.add('uw-lb-grabbing');
                try { viewport.setPointerCapture(e.pointerId); } catch (pe) {}
            });

            document.body.appendChild(lb);
            uwLbZoomIdx = 0;
            uwApplyLbZoom();
            closeBtn.focus();
        }

        function uwBuildMap(sectionEl) {
            var hoverable = window.matchMedia
                && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

            var toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'map-toggle';
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-controls', 'uw-map-body');
            toggle.innerHTML =
                '<svg class="map-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>' +
                '<span class="map-toggle-latin">UMINARI-CHO MAP · </span>' +
                '<span>町内案内图</span>' +
                '<span class="map-toggle-count">' + UW_MAP.pins.length + ' 地点</span>' +
                '<svg class="map-toggle-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
            sectionEl.appendChild(toggle);

            var body = document.createElement('div');
            body.id = 'uw-map-body';
            body.className = 'map-body';
            body.hidden = true;
            sectionEl.appendChild(body);

            var frame = document.createElement('div');
            frame.className = 'map-frame';
            body.appendChild(frame);

            var canvas = document.createElement('div');
            canvas.className = 'uw-map-canvas';
            canvas.style.backgroundImage = 'url("' + UW_MAP.img + '")';
            canvas.setAttribute('role', 'region');
            canvas.setAttribute('aria-label', '海鸣町交互地图，共' + UW_MAP.pins.length + '个地点');

            if (window.CSS && !CSS.supports('aspect-ratio', '1 / 1')) {
                canvas.uwFixH = function() {
                    canvas.style.height = Math.round(canvas.clientWidth * 833 / 1000) + 'px';
                };
                canvas.uwFixH();
                window.addEventListener('resize', canvas.uwFixH);
            }
            frame.appendChild(canvas);

            UW_MAP.pins.forEach(function(pinData, idx) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'uw-pin';
                btn.style.left = pinData.x + '%';
                btn.style.top = pinData.y + '%';
                btn.style.setProperty('--uw-pin-color', UW_MAP.cats[pinData.cat].color);
                btn.setAttribute('aria-label', pinData.name + '（' + UW_MAP.cats[pinData.cat].legend + '）');
                btn.dataset.idx = idx;
                var dot = document.createElement('span');
                dot.className = 'uw-pin-dot';
                btn.appendChild(dot);
                canvas.appendChild(btn);
            });

            var tip = document.createElement('div');
            tip.className = 'uw-tip';
            tip.setAttribute('role', 'tooltip');
            canvas.appendChild(tip);

            canvas.addEventListener('click', function(e) {
                if (uwSuppressClick) { uwSuppressClick = false; return; }
                var pinEl = e.target.closest ? e.target.closest('.uw-pin') : null;
                if (!pinEl) {
                    uwCloseTip();
                    uwOpenLightbox();
                    return;
                }
                var idx = parseInt(pinEl.dataset.idx, 10);
                var isSel = pinEl.classList.contains('uw-pin--sel');
                if (!hoverable && !isSel) {
                    uwOpenTip(UW_MAP.pins[idx], pinEl);
                } else {
                    uwTravel(UW_MAP.pins[idx]);
                }
            });

            /* 桌面端：悬停即显示介绍气泡，移开后关闭 */
            if (hoverable) {
                canvas.addEventListener('mouseover', function(e) {
                    var pinEl = e.target.closest ? e.target.closest('.uw-pin') : null;
                    if (!pinEl) return;
                    var idx = parseInt(pinEl.dataset.idx, 10);
                    uwOpenTip(UW_MAP.pins[idx], pinEl);
                });
                canvas.addEventListener('mouseout', function(e) {
                    var pinEl = e.target.closest ? e.target.closest('.uw-pin') : null;
                    if (!pinEl) return;
                    uwCloseTip();
                });
            }

            sectionEl.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') uwCloseTip();
            });

            var legend = document.createElement('div');
            legend.className = 'uw-map-legend';
            Object.keys(UW_MAP.cats).forEach(function(key) {
                var cat = UW_MAP.cats[key];
                var item = document.createElement('span');
                item.className = 'uw-lg';
                var dot = document.createElement('span');
                dot.className = 'uw-lg-dot';
                dot.style.background = cat.color;
                item.appendChild(dot);
                item.appendChild(document.createTextNode(cat.legend));
                legend.appendChild(item);
            });
            frame.appendChild(legend);

            var captionRow = document.createElement('div');
            captionRow.className = 'uw-map-caption-row';
            var caption = document.createElement('span');
            caption.className = 'uw-map-caption';
            caption.textContent = 'NO. 00 / UMINARI-CHO GUIDE MAP ★';
            var expandBtn = document.createElement('button');
            expandBtn.type = 'button';
            expandBtn.className = 'uw-map-expand';
            expandBtn.setAttribute('aria-label', '放大查看町内案内图');
            expandBtn.innerHTML =
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg>' +
                '<span>放大查看</span>';
            expandBtn.addEventListener('click', function() { uwOpenLightbox(); });
            captionRow.appendChild(caption);
            captionRow.appendChild(expandBtn);
            frame.appendChild(captionRow);

            var hint = document.createElement('div');
            hint.className = 'uw-map-hint';
            hint.textContent = hoverable
                ? '悬停查看介绍 · 点击地点前往 · 点空白处放大'
                : '点按地点查看 · 再点前往 · 点空白处放大';
            body.appendChild(hint);

            toggle.addEventListener('click', function() {
                var open = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', String(!open));
                body.hidden = open;
            });
        }

        function uwMarkCurrent(locationStr) {
            var canvas = uwGetCanvas();
            if (!canvas) return;
            var nowPins = canvas.querySelectorAll('.uw-pin--now');
            for (var i = 0; i < nowPins.length; i++) nowPins[i].classList.remove('uw-pin--now');
            var hit = uwMatchLocation(locationStr);
            if (hit < 0) return;
            var pinEl = canvas.querySelector('.uw-pin[data-idx="' + hit + '"]');
            if (pinEl) pinEl.classList.add('uw-pin--now');
        }

        function uwMarkCharacters(data) {
            var canvas = uwGetCanvas();
            if (!canvas) return;
            var olds = canvas.querySelectorAll('.uw-char');
            for (var i = 0; i < olds.length; i++) olds[i].parentNode.removeChild(olds[i]);
            var byPin = {};
            UW_MAP.chars.forEach(function(ch) {
                var loc = data[ch.field];
                if (!loc) return;
                var idx = uwMatchLocation(loc);
                if (idx < 0) return;
                if (!byPin[idx]) byPin[idx] = [];
                byPin[idx].push({ ch: ch, loc: loc });
            });
            Object.keys(byPin).forEach(function(idxStr) {
                var idx = parseInt(idxStr, 10);
                var pinEl = canvas.querySelector('.uw-pin[data-idx="' + idx + '"]');
                if (!pinEl) return;
                var list = byPin[idxStr];
                list.forEach(function(item, i) {
                    var offset = Math.round((i - (list.length - 1) / 2) * 34);
                    var el = document.createElement('div');
                    el.className = 'uw-char';
                    el.style.left = pinEl.style.left;
                    el.style.top = pinEl.style.top;
                    el.style.transform = 'translate(calc(-50% + ' + offset + 'px), calc(-100% - 8px))';
                    el.style.setProperty('--uw-char-color', item.ch.color);
                    el.setAttribute('role', 'img');
                    el.setAttribute('aria-label', item.ch.name + '当前在' + UW_MAP.pins[idx].name);
                    var img = document.createElement('img');
                    img.className = 'uw-char-img';
                    img.src = item.ch.img;
                    img.alt = '';
                    img.draggable = false;
                    img.decoding = 'async';
                    var chip = document.createElement('span');
                    chip.className = 'uw-char-name';
                    chip.textContent = item.ch.name;
                    el.appendChild(img);
                    el.appendChild(chip);
                    canvas.appendChild(el);
                });
            });
        }

        function renderMap(data) {
            var sectionEl = document.querySelector('.uw-map');
            if (!sectionEl) return;
            if (!sectionEl.dataset.uwBuilt) {
                try {
                    uwBuildMap(sectionEl);
                    sectionEl.dataset.uwBuilt = '1';
                } catch (mapErr) {
                    sectionEl.dataset.uwBuilt = '1';
                    console.error('[UW_MAP] init failed:', mapErr);
                }
            }
            uwMarkCurrent(data.location);
            uwMarkCharacters(data);
        }

        /* ================= Q版小人与音乐盒 ================= */
        var UW_Q = {
            base: 'https://raw.githubusercontent.com/roxysl521-droid/bingruo-li-hui/main/',
            emotionMap: {
                '开心': '开心', '喜欢': '开心',
                '生气': '生气', '吃醋': '生气',
                '嫌弃': '嫌弃',
                '伤心': '平淡', '紧张': '平淡', '淡定': '平淡', '害羞': '平淡', '惊讶': '平淡'
            },
            bubble: { '澪': '呀……放、放下我……', '鹤': '哈哈，抓不住我～' },
            tracksPure: [
                { name: 'Angel Note,井ノ原智 - くつろぎの間', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/Angel%20Note%2C%E4%BA%95%E3%83%8E%E5%8E%9F%E6%99%BA%20-%20%E3%81%8F%E3%81%A4%E3%82%8D%E3%81%8E%E3%81%AE%E9%96%93.mp3' },
                { name: 'Angel Note,井ノ原智 - ずっこけ涙節', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/Angel%20Note%2C%E4%BA%95%E3%83%8E%E5%8E%9F%E6%99%BA%20-%20%E3%81%9A%E3%81%A3%E3%81%93%E3%81%91%E6%B6%99%E7%AF%80.mp3' },
                { name: 'Angel Note,井ノ原智 - なぜに何故？', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/Angel%20Note%2C%E4%BA%95%E3%83%8E%E5%8E%9F%E6%99%BA%20-%20%E3%81%AA%E3%81%9C%E3%81%AB%E4%BD%95%E6%95%85%EF%BC%9F.mp3' },
                { name: 'Angel Note,井ノ原智 - はて？', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/Angel%20Note%2C%E4%BA%95%E3%83%8E%E5%8E%9F%E6%99%BA%20-%20%E3%81%AF%E3%81%A6%EF%BC%9F.mp3' },
                { name: 'Angel Note,井ノ原智 - ビックリ仰天', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/Angel%20Note%2C%E4%BA%95%E3%83%8E%E5%8E%9F%E6%99%BA%20-%20%E3%83%93%E3%83%83%E3%82%AF%E3%83%AA%E4%BB%B0%E5%A4%A9.mp3' },
                { name: 'Angel Note,井ノ原智 - 今昔の街', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/Angel%20Note%2C%E4%BA%95%E3%83%8E%E5%8E%9F%E6%99%BA%20-%20%E4%BB%8A%E6%98%94%E3%81%AE%E8%A1%97.mp3' },
                { name: 'Angel Note,井ノ原智 - 慎ましき朝', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/Angel%20Note%2C%E4%BA%95%E3%83%8E%E5%8E%9F%E6%99%BA%20-%20%E6%85%8E%E3%81%BE%E3%81%97%E3%81%8D%E6%9C%9D.mp3' },
                { name: 'sawamurah - いつか見た夢', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/sawamurah%20-%20%E3%81%84%E3%81%A4%E3%81%8B%E8%A6%8B%E3%81%9F%E5%A4%A2.mp3' },
                { name: 'sawamurah - おかえりなさい', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/sawamurah%20-%20%E3%81%8A%E3%81%8B%E3%81%88%E3%82%8A%E3%81%AA%E3%81%95%E3%81%84.mp3' },
                { name: 'sawamurah - のんびりしたいね', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/sawamurah%20-%20%E3%81%AE%E3%82%93%E3%81%B3%E3%82%8A%E3%81%97%E3%81%9F%E3%81%84%E3%81%AD.mp3' },
                { name: 'sawamurah - はずむ足どり', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/sawamurah%20-%20%E3%81%AF%E3%81%9A%E3%82%80%E8%B6%B3%E3%81%A9%E3%82%8A.mp3' },
                { name: 'sawamurah - スクールライフ', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/sawamurah%20-%20%E3%82%B9%E3%82%AF%E3%83%BC%E3%83%AB%E3%83%A9%E3%82%A4%E3%83%95.mp3' },
                { name: 'sawamurah - タ映え影二つ', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/sawamurah%20-%20%E3%82%BF%E6%98%A0%E3%81%88%E5%BD%B1%E4%BA%8C%E3%81%A4.mp3' },
                { name: 'sawamurah - 優しい優しいオモテナシ', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/sawamurah%20-%20%E5%84%AA%E3%81%97%E3%81%84%E5%84%AA%E3%81%97%E3%81%84%E3%82%AA%E3%83%A2%E3%83%86%E3%83%8A%E3%82%B7.mp3' },
                { name: 'sawamurah - 四季折々', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/sawamurah%20-%20%E5%9B%9B%E5%AD%A3%E6%8A%98%E3%80%85.mp3' },
                { name: 'sawamurah - 夕涼みの歩み', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/sawamurah%20-%20%E5%A4%95%E6%B6%BC%E3%81%BF%E3%81%AE%E6%AD%A9%E3%81%BF.mp3' },
                { name: 'sawamurah - 夕焼けのひだまり', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/sawamurah%20-%20%E5%A4%95%E7%84%BC%E3%81%91%E3%81%AE%E3%81%B2%E3%81%A0%E3%81%BE%E3%82%8A.mp3' },
                { name: 'sawamurah - 木漏れ日スマイル', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/sawamurah%20-%20%E6%9C%A8%E6%BC%8F%E3%82%8C%E6%97%A5%E3%82%B9%E3%83%9E%E3%82%A4%E3%83%AB.mp3' },
                { name: 'sawamurah - 雪踏み', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/sawamurah%20-%20%E9%9B%AA%E8%B8%8F%E3%81%BF.mp3' },
                { name: 'sawamurah - 静寂のまなざし', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge_dan_chun/main/sawamurah%20-%20%E9%9D%99%E5%AF%82%E3%81%AE%E3%81%BE%E3%81%AA%E3%81%96%E3%81%97.mp3' }
            ],
            tracks: [
                { name: '3-11. Alka Tale', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/3-11.%20Alka%20Tale.mp3' },
                { name: '3-12. Lasting Moment', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/3-12.%20Lasting%20Moment.mp3' },
                { name: 'DracoVirgo - 清廉なるHeretics', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/DracoVirgo%20-%20%E6%B8%85%E5%BB%89%E3%81%AA%E3%82%8BHeretics.mp3' },
                { name: 'Duca - Memoria', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/Duca%20-%20Memoria.mp3' },
                { name: 'Duca - coincidence', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/Duca%20-%20coincidence.mp3' },
                { name: 'Duca - ずっとそばで… (off vocal ver.)', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/Duca%20-%20%E3%81%9A%E3%81%A3%E3%81%A8%E3%81%9D%E3%81%B0%E3%81%A7%E2%80%A6%20(off%20vocal%20ver.).mp3' },
                { name: 'Famishin,KOTOKO - 恋ひ恋ふ縁', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/Famishin%2CKOTOKO%20-%20%E6%81%8B%E3%81%B2%E6%81%8B%E3%81%B5%E7%B8%81.mp3' },
                { name: 'LONGMAN - spiral', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/LONGMAN%20-%20spiral.mp3' },
                { name: 'eufonius - 比翼の羽根', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/eufonius%20-%20%E6%AF%94%E7%BF%BC%E3%81%AE%E7%BE%BD%E6%A0%B9.mp3' },
                { name: 'yuiko - GLORIOUS DAYS', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/yuiko%20-%20GLORIOUS%20DAYS.mp3' },
                { name: 'かぐや(cv.夏吉ゆうこ),超かぐや姫！ - ハッピーシンセサイザ (Cover)', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E3%81%8B%E3%81%90%E3%82%84(cv.%E5%A4%8F%E5%90%89%E3%82%86%E3%81%86%E3%81%93)%2C%E8%B6%85%E3%81%8B%E3%81%90%E3%82%84%E5%A7%AB%EF%BC%81%20-%20%E3%83%8F%E3%83%83%E3%83%94%E3%83%BC%E3%82%B7%E3%83%B3%E3%82%BB%E3%82%B5%E3%82%A4%E3%82%B6%20(Cover).mp3' },
                { name: 'はな - 櫻ノ詩', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E3%81%AF%E3%81%AA%20-%20%E6%AB%BB%E3%83%8E%E8%A9%A9.mp3' },
                { name: 'トゲナシトゲアリ - 空の箱 (井芹仁菜、河原木桃香)', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E3%83%88%E3%82%B2%E3%83%8A%E3%82%B7%E3%83%88%E3%82%B2%E3%82%A2%E3%83%AA%20-%20%E7%A9%BA%E3%81%AE%E7%AE%B1%20(%E4%BA%95%E8%8A%B9%E4%BB%81%E8%8F%9C%E3%80%81%E6%B2%B3%E5%8E%9F%E6%9C%A8%E6%A1%83%E9%A6%99).mp3' },
                { name: 'トゲナシトゲアリ - 雑踏、僕らの街', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E3%83%88%E3%82%B2%E3%83%8A%E3%82%B7%E3%83%88%E3%82%B2%E3%82%A2%E3%83%AA%20-%20%E9%9B%91%E8%B8%8F%E3%80%81%E5%83%95%E3%82%89%E3%81%AE%E8%A1%97.mp3' },
                { name: '七音阿卡莉,ナユタン星人 - ムリムリ進化論', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E4%B8%83%E9%9F%B3%E9%98%BF%E5%8D%A1%E8%8E%89%2C%E3%83%8A%E3%83%A6%E3%82%BF%E3%83%B3%E6%98%9F%E4%BA%BA%20-%20%E3%83%A0%E3%83%AA%E3%83%A0%E3%83%AA%E9%80%B2%E5%8C%96%E8%AB%96.mp3' },
                { name: '上原れな - 届かない恋', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E4%B8%8A%E5%8E%9F%E3%82%8C%E3%81%AA%20-%20%E5%B1%8A%E3%81%8B%E3%81%AA%E3%81%84%E6%81%8B.mp3' },
                { name: '佐々木詩織 - Indigo Star', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E4%BD%90%E3%80%85%E6%9C%A8%E8%A9%A9%E7%B9%94%20-%20Indigo%20Star.mp3' },
                { name: '倚水 - おやすみモノクローム', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E5%80%9A%E6%B0%B4%20-%20%E3%81%8A%E3%82%84%E3%81%99%E3%81%BF%E3%83%A2%E3%83%8E%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%A0.mp3' },
                { name: '塞壬唱片-MSR,Adam Gubman,Nini Guerry - Morning Dew', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E5%A1%9E%E5%A3%AC%E5%94%B1%E7%89%87-MSR%2CAdam%20Gubman%2CNini%20Guerry%20-%20Morning%20Dew.mp3' },
                { name: '塞壬唱片-MSR,DAZBEE - 酸橙色信笺', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E5%A1%9E%E5%A3%AC%E5%94%B1%E7%89%87-MSR%2CDAZBEE%20-%20%E9%85%B8%E6%A9%99%E8%89%B2%E4%BF%A1%E7%AC%BA.mp3' },
                { name: '塞壬唱片-MSR,WS MUSIC - Little Wish', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E5%A1%9E%E5%A3%AC%E5%94%B1%E7%89%87-MSR%2CWS%20MUSIC%20-%20Little%20Wish.mp3' },
                { name: '塞壬唱片-MSR,chengcheng,Kat Kennedy - Sanctuary Inside', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E5%A1%9E%E5%A3%AC%E5%94%B1%E7%89%87-MSR%2Cchengcheng%2CKat%20Kennedy%20-%20Sanctuary%20Inside.mp3' },
                { name: '塞壬唱片-MSR,平林佑人,星熊南巫 - 直到大地变成一颗酸橙', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E5%A1%9E%E5%A3%AC%E5%94%B1%E7%89%87-MSR%2C%E5%B9%B3%E6%9E%97%E4%BD%91%E4%BA%BA%2C%E6%98%9F%E7%86%8A%E5%8D%97%E5%B7%AB%20-%20%E7%9B%B4%E5%88%B0%E5%A4%A7%E5%9C%B0%E5%8F%98%E6%88%90%E4%B8%80%E9%A2%97%E9%85%B8%E6%A9%99.mp3' },
                { name: '塞壬唱片-MSR,橘猫烧鲷鱼 - Every Road is a Yes', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E5%A1%9E%E5%A3%AC%E5%94%B1%E7%89%87-MSR%2C%E6%A9%98%E7%8C%AB%E7%83%A7%E9%B2%B7%E9%B1%BC%20-%20Every%20Road%20is%20a%20Yes.mp3' },
                { name: '夢乃ゆき - With Tomorrow', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E5%A4%A2%E4%B9%83%E3%82%86%E3%81%8D%20-%20With%20Tomorrow.mp3' },
                { name: '大地葉,藤田茜,戸田めぐみ - FUN FUN RE-BOOT', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E5%A4%A7%E5%9C%B0%E8%91%89%2C%E8%97%A4%E7%94%B0%E8%8C%9C%2C%E6%88%B8%E7%94%B0%E3%82%81%E3%81%90%E3%81%BF%20-%20FUN%20FUN%20RE-BOOT.mp3' },
                { name: '山本美禰子 - 輪廻', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E5%B1%B1%E6%9C%AC%E7%BE%8E%E7%A6%B0%E5%AD%90%20-%20%E8%BC%AA%E5%BB%BB.mp3' },
                { name: '幾田りら - ハミング', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E5%B9%BE%E7%94%B0%E3%82%8A%E3%82%89%20-%20%E3%83%8F%E3%83%9F%E3%83%B3%E3%82%B0.mp3' },
                { name: '幾田りら - 恋風', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E5%B9%BE%E7%94%B0%E3%82%8A%E3%82%89%20-%20%E6%81%8B%E9%A2%A8.mp3' },
                { name: '幾田りら - 百花繚乱', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E5%B9%BE%E7%94%B0%E3%82%8A%E3%82%89%20-%20%E7%99%BE%E8%8A%B1%E7%B9%9A%E4%B9%B1.mp3' },
                { name: '月乃 - ドーナドーナのうた', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E6%9C%88%E4%B9%83%20-%20%E3%83%89%E3%83%BC%E3%83%8A%E3%83%89%E3%83%BC%E3%83%8A%E3%81%AE%E3%81%86%E3%81%9F.mp3' },
                { name: '松下 - raspberry cube', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E6%9D%BE%E4%B8%8B%20-%20raspberry%20cube.mp3' },
                { name: '榊原ゆい - Scarlet', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E6%A6%8A%E5%8E%9F%E3%82%86%E3%81%84%20-%20Scarlet.mp3' },
                { name: '櫻川めぐ - Unreal Creation!', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E6%AB%BB%E5%B7%9D%E3%82%81%E3%81%90%20-%20Unreal%20Creation!.mp3' },
                { name: '浅葉リオ - 二人だけのカーテンコール', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E6%B5%85%E8%91%89%E3%83%AA%E3%82%AA%20-%20%E4%BA%8C%E4%BA%BA%E3%81%A0%E3%81%91%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%86%E3%83%B3%E3%82%B3%E3%83%BC%E3%83%AB.mp3' },
                { name: '熊田茜音,増井優花,名探偵プリキュア！ - なぜ？謎？！ANSWER(TVサイズ)', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E7%86%8A%E7%94%B0%E8%8C%9C%E9%9F%B3%2C%E5%A2%97%E4%BA%95%E5%84%AA%E8%8A%B1%2C%E5%90%8D%E6%8E%A2%E5%81%B5%E3%83%97%E3%83%AA%E3%82%AD%E3%83%A5%E3%82%A2%EF%BC%81%20-%20%E3%81%AA%E3%81%9C%EF%BC%9F%E8%AC%8E%EF%BC%9F%EF%BC%81ANSWER(TV%E3%82%B5%E3%82%A4%E3%82%BA).mp3' },
                { name: '片霧烈火,鈴湯 - Girl meets Love', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E7%89%87%E9%9C%A7%E7%83%88%E7%81%AB%2C%E9%88%B4%E6%B9%AF%20-%20Girl%20meets%20Love.mp3' },
                { name: '知更鸟,HOYO-MiX,Chevy - 唯有追赶风的方向', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E7%9F%A5%E6%9B%B4%E9%B8%9F%2CHOYO-MiX%2CChevy%20-%20%E5%94%AF%E6%9C%89%E8%BF%BD%E8%B5%B6%E9%A3%8E%E7%9A%84%E6%96%B9%E5%90%91.mp3' },
                { name: '米倉千尋 - Be braver!', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E7%B1%B3%E5%80%89%E5%8D%83%E5%B0%8B%20-%20Be%20braver!.mp3' },
                { name: '米倉千尋 - Smiling-Swinging!!', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E7%B1%B3%E5%80%89%E5%8D%83%E5%B0%8B%20-%20Smiling-Swinging!!.mp3' },
                { name: '米倉千尋 - 恋せよ乙女！', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E7%B1%B3%E5%80%89%E5%8D%83%E5%B0%8B%20-%20%E6%81%8B%E3%81%9B%E3%82%88%E4%B9%99%E5%A5%B3%EF%BC%81.mp3' },
                { name: '美郷あき - DESIRE', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E7%BE%8E%E9%83%B7%E3%81%82%E3%81%8D%20-%20DESIRE.mp3' },
                { name: '鈴木このみ - アルカテイル', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E9%88%B4%E6%9C%A8%E3%81%93%E3%81%AE%E3%81%BF%20-%20%E3%82%A2%E3%83%AB%E3%82%AB%E3%83%86%E3%82%A4%E3%83%AB.mp3' },
                { name: '鈴木このみ,VISUAL ARTS Key - Lasting Moment', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E9%88%B4%E6%9C%A8%E3%81%93%E3%81%AE%E3%81%BF%2CVISUAL%20ARTS%20Key%20-%20Lasting%20Moment.mp3' },
                { name: '鈴木このみ,VISUAL ARTS Key - アスタロア', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E9%88%B4%E6%9C%A8%E3%81%93%E3%81%AE%E3%81%BF%2CVISUAL%20ARTS%20Key%20-%20%E3%82%A2%E3%82%B9%E3%82%BF%E3%83%AD%E3%82%A2.mp3' },
                { name: '長谷川育美 - 鍵', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E9%95%B7%E8%B0%B7%E5%B7%9D%E8%82%B2%E7%BE%8E%20-%20%E9%8D%B5.mp3' },
                { name: '高橋李依 - Stay Alive ～Regain～', url: 'https://raw.githubusercontent.com/roxysl521-droid/ge-dan/main/%E9%AB%98%E6%A9%8B%E6%9D%8E%E4%BE%9D%20-%20Stay%20Alive%20%EF%BD%9ERegain%EF%BD%9E.mp3' }
            ]
        };

        function uwQChar(roleName) {
            if (roleName && roleName.indexOf('澪') !== -1) return '澪';
            if (roleName && roleName.indexOf('鹤') !== -1) return '鹤';
            return '澪';
        }

        function uwQFile(ch, emotion) {
            return UW_Q.base + encodeURIComponent(ch + '_' + emotion + '_q.png');
        }

        function uwDetectEmotion(rawText, roleName) {
            var ch = uwQChar(roleName);
            if (!rawText) return '平淡';
            var re = new RegExp('\\[[^\\]|]*' + ch + '[^\\]|]*\\|([^\\]|]{1,6})\\]', 'g');
            var m, last = null;
            while ((m = re.exec(rawText)) !== null) {
                var word = m[1].replace(/^\s+|\s+$/g, '');
                if (UW_Q.emotionMap[word] !== undefined) last = word;
            }
            if (!last) return '平淡';
            return UW_Q.emotionMap[last] || '平淡';
        }

        function uwSetQImg(imgEl, url, onDone) {
            var pre = new Image();
            pre.onload = function() {
                imgEl.classList.remove('uw-q-loading');
                imgEl.src = url;
                if (onDone) onDone();
            };
            pre.onerror = function() {
                imgEl.classList.remove('uw-q-loading');
                imgEl.classList.add('uw-q-error');
                if (onDone) onDone();
            };
            pre.src = url;
        }

        function uwCheckFlatBg(imgEl) {
            try {
                var c = document.createElement('canvas');
                c.width = 64;
                c.height = 64;
                var g = c.getContext('2d');
                if (!g) return;
                g.drawImage(imgEl, 0, 0, 64, 64);
                var d = g.getImageData(0, 0, 64, 64).data;
                var white = true;
                for (var y = 0; y < 64 && white; y++) {
                    for (var x = 0; x < 64; x++) {
                        if (x > 1 && x < 62 && y > 1 && y < 62) continue;
                        var k = (y * 64 + x) * 4;
                        if (d[k + 3] > 250 && (d[k] < 243 || d[k + 1] < 243 || d[k + 2] < 243)) { white = false; break; }
                    }
                }
                imgEl.classList.toggle('uw-q-img--flat', white);
            } catch (e) { /* 画布被跨域污染时保持默认显示 */ }
        }

        var uwQState = { ch: '澪', emotion: '平淡', dragging: false };

        function uwSetQEmotion(emotion) {
            uwQState.emotion = emotion;
            var img = document.querySelector('.uw-q-img');
            if (img) {
                img.classList.remove('uw-q-error');
                uwSetQImg(img, uwQFile(uwQState.ch, emotion));
            }
            var chibi = document.querySelector('.uw-q-chibi');
            if (chibi) chibi.setAttribute('aria-label', '潮见' + uwQState.ch + '的Q版形象（' + emotion + '）：点击打开音乐盒，可拖动');
        }

        function uwSetGrab(on) {
            var img = document.querySelector('.uw-q-img');
            var btn = document.querySelector('.uw-q-chibi');
            var bubble = document.querySelector('.uw-q-bubble');
            if (!img || !btn || !bubble) return;
            btn.classList.toggle('uw-q-chibi--grab', on);
            if (on) {
                img.classList.remove('uw-q-error');
                uwSetQImg(img, uwQFile(uwQState.ch, '抓起'));
                bubble.textContent = UW_Q.bubble[uwQState.ch] || '放我下来～';
                bubble.classList.add('uw-q-bubble--show');
            } else {
                bubble.classList.remove('uw-q-bubble--show');
                uwSetQEmotion(uwQState.emotion);
            }
        }

        function uwBuildQ(sectionEl) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'uw-q-chibi';
            btn.setAttribute('aria-label', 'Q版小人：点击打开音乐盒，可拖动');
            var img = document.createElement('img');
            img.className = 'uw-q-img';
            img.alt = '';
            img.crossOrigin = 'anonymous';
            img.draggable = false;
            img.decoding = 'async';
            img.addEventListener('load', function() { uwCheckFlatBg(img); });
            btn.appendChild(img);

            var bubble = document.createElement('span');
            bubble.className = 'uw-q-bubble';
            bubble.setAttribute('aria-hidden', 'true');

            btn.appendChild(bubble);
            sectionEl.appendChild(btn);

            var hoverable = window.matchMedia
                && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            var drag = { on: false, moved: false, sx: 0, sy: 0, ox: 0, oy: 0 };

            function clampPos(nx, ny) {
                var maxX = sectionEl.clientWidth - btn.offsetWidth;
                var maxY = sectionEl.clientHeight - btn.offsetHeight;
                return {
                    x: Math.max(0, Math.min(nx, maxX)),
                    y: Math.max(0, Math.min(ny, maxY))
                };
            }

            btn.addEventListener('pointerdown', function(e) {
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                drag.on = true;
                drag.moved = false;
                drag.sx = e.clientX;
                drag.sy = e.clientY;
                var br = btn.getBoundingClientRect();
                var sr = sectionEl.getBoundingClientRect();
                drag.ox = br.left - sr.left;
                drag.oy = br.top - sr.top;
                try { btn.setPointerCapture(e.pointerId); } catch (pe) {}
                e.preventDefault();
            });

            btn.addEventListener('pointermove', function(e) {
                if (!drag.on) return;
                var dx = e.clientX - drag.sx;
                var dy = e.clientY - drag.sy;
                if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 6) {
                    drag.moved = true;
                    uwQState.dragging = true;
                    uwSetGrab(true);
                }
                if (drag.moved) {
                    var p = clampPos(drag.ox + dx, drag.oy + dy);
                    btn.style.left = p.x + 'px';
                    btn.style.top = p.y + 'px';
                    btn.style.right = 'auto';
                    btn.style.bottom = 'auto';
                }
            });

            function endDrag(e) {
                if (!drag.on) return;
                drag.on = false;
                if (drag.moved) {
                    uwQState.dragging = false;
                    uwSetGrab(false);
                    uwQSuppressClick = true;
                    setTimeout(function() { uwQSuppressClick = false; }, 0);
                }
                try { btn.releasePointerCapture(e.pointerId); } catch (pe) {}
            }
            btn.addEventListener('pointerup', endDrag);
            btn.addEventListener('pointercancel', endDrag);

            if (hoverable) {
                btn.addEventListener('mouseenter', function() {
                    if (!uwQState.dragging) {
                        var img2 = document.querySelector('.uw-q-img');
                        if (img2) {
                            img2.classList.remove('uw-q-error');
                            uwSetQImg(img2, uwQFile(uwQState.ch, '嫌弃'));
                        }
                    }
                });
                btn.addEventListener('mouseleave', function() {
                    if (!uwQState.dragging) uwSetQEmotion(uwQState.emotion);
                });
            }

            btn.addEventListener('click', function() {
                if (uwQSuppressClick) { uwQSuppressClick = false; return; }
                uwOpenPlayer();
            });
        }

        function uwInitQ(data) {
            var sectionEl = document.querySelector('.q-widget');
            if (!sectionEl) return;
            if (!sectionEl.dataset.qBuilt) {
                try {
                    uwBuildQ(sectionEl);
                    sectionEl.dataset.qBuilt = '1';
                } catch (qErr) {
                    sectionEl.dataset.qBuilt = '1';
                    console.error('[UW_Q] init failed:', qErr);
                }
            }
            uwQState.ch = uwQChar(data.role);
            uwSetQEmotion(uwDetectEmotion(data.raw, data.role));
        }

        /* ================= 音乐盒 ================= */
        var uwPlayer = { audio: null, idx: -1, opener: null, shuffle: false, list: 0 };
        var uwQSuppressClick = false;

        function uwFmtTime(sec) {
            if (!isFinite(sec)) return '0:00';
            var m = Math.floor(sec / 60);
            var s = Math.floor(sec % 60);
            return m + ':' + (s < 10 ? '0' : '') + s;
        }

        function uwAudioEl() {
            if (!uwPlayer.audio) {
                uwPlayer.audio = new Audio();
                uwPlayer.audio.volume = 0.85;
                uwPlayer.audio.preload = 'auto';
                uwPlayer.audio.addEventListener('error', function() {
                    var a = uwPlayer.audio;
                    if (!a || !a.src) return;
                    var sub = document.querySelector('.uw-player-sub');
                    var att = 0;
                    try { att = parseInt(a.dataset.uwAtt || '0', 10) || 0; } catch (e) {}
                    if (att < 1) {
                        try { a.dataset.uwAtt = '1'; } catch (e) {}
                        if (sub) sub.textContent = '缓冲重试中…';
                        setTimeout(function() {
                            try { a.load(); var p = a.play(); if (p && p.catch) p.catch(function() {}); } catch (e) {}
                        }, 900);
                    } else if (att < 2) {
                        var fb = uwTrackFallback(a.src);
                        if (!fb) {
                            try { delete a.dataset.uwAtt; } catch (e) {}
                            if (sub) sub.textContent = '该曲目暂时无法播放，点歌单重试';
                            uwSyncPlayUi(false);
                            return;
                        }
                        try { a.dataset.uwAtt = '2'; } catch (e) {}
                        if (sub) sub.textContent = '切换线路重试中…';
                        try { a.src = fb; a.load(); var p2 = a.play(); if (p2 && p2.catch) p2.catch(function() {}); } catch (e) {}
                    } else {
                        try { delete a.dataset.uwAtt; } catch (e) {}
                        if (sub) sub.textContent = '该曲目暂时无法播放，点歌单重试';
                        uwSyncPlayUi(false);
                    }
                });
                uwPlayer.audio.addEventListener('timeupdate', function() {
                    var fill = document.querySelector('.uw-player-fill');
                    var t = document.querySelector('.uw-player-time');
                    var a = uwPlayer.audio;
                    if (fill && a.duration) fill.style.width = (a.currentTime / a.duration * 100) + '%';
                    if (t) t.textContent = uwFmtTime(a.currentTime) + ' / ' + uwFmtTime(a.duration);
                });
                uwPlayer.audio.addEventListener('ended', function() {
                    uwPlayNext();
                });
                uwPlayer.audio.addEventListener('play', function() { uwSyncPlayUi(true); });
                uwPlayer.audio.addEventListener('pause', function() { uwSyncPlayUi(false); });
            }
            return uwPlayer.audio;
        }

        function uwSyncPlayUi(playing) {
            var panel = document.querySelector('.uw-player');
            if (panel) panel.classList.toggle('uw-player--playing', playing);
            var main = document.querySelector('.uw-player-ctl--main');
            if (main) main.innerHTML = playing
                ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg>'
                : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"></path></svg>';
        }

        function uwRenderPlaylist() {
            var list = document.querySelector('.uw-player-list');
            if (!list) return;
            list.innerHTML = '';
            if (!uwActiveTracks().length) {
                var empty = document.createElement('div');
                empty.className = 'uw-player-empty';
                empty.textContent = '曲库还空着。在正则里找到 UW_Q.tracks，按 { name: "曲名", url: "音乐直链" } 的格式填入歌曲，保存刷新后这里就会亮起来。';
                list.appendChild(empty);
                return;
            }
            uwActiveTracks().forEach(function(t, i) {
                var row = document.createElement('button');
                row.type = 'button';
                row.className = 'uw-player-row' + (i === uwPlayer.idx ? ' uw-player-row--active' : '');
                var n = document.createElement('span');
                n.textContent = (i + 1) + '. ' + (t.name || '未命名曲目');
                row.appendChild(n);
                row.addEventListener('click', function() { uwPlayTrack(i); });
                list.appendChild(row);
            });
        }

        function uwPlayTrack(i) {
            var tracks = uwActiveTracks();
            if (!tracks.length) return;
            uwPlayer.idx = ((i % tracks.length) + tracks.length) % tracks.length;
            var t = tracks[uwPlayer.idx];
            var a = uwAudioEl();
            try { delete a.dataset.uwAtt; } catch (e) {}
            a.src = t.url;
            var sub = document.querySelector('.uw-player-sub');
            var title = document.querySelector('.uw-player-track');
            if (title) title.textContent = t.name || '未命名曲目';
            if (sub) sub.textContent = '正在加载…';
            uwRenderPlaylist();
            a.play().then(function() {
                if (sub) sub.textContent = '音乐盒 · Track ' + (uwPlayer.idx + 1);
            }).catch(function(err) {
                if (sub) sub.textContent = '该曲目暂时无法播放';
                console.error('[UW_Q] play failed:', err);
            });
        }

        function uwTrackFallback(url) {
            var m = String(url).match(/^https:\/\/raw\.githubusercontent\.com\/([^\/]+\/[^\/]+)\/main\/(.+)$/);
            if (!m) return '';
            return 'https://cdn.jsdelivr.net/gh/' + m[1] + '@main/' + m[2];
        }
        function uwActiveTracks() {
            return uwPlayer.list === 1 ? UW_Q.tracksPure : UW_Q.tracks;
        }
        function uwSwitchList(n, autoplay) {
            var lists = [UW_Q.tracks, UW_Q.tracksPure];
            if (uwPlayer.list === n) return;
            if (!lists[n] || !lists[n].length) return;
            uwPlayer.list = n;
            try { uwAudioEl().pause(); } catch (e) {}
            uwPlayer.idx = -1;
            uwRenderPlaylist();
            var panel = document.querySelector('.uw-player');
            if (panel) {
                var tabs = panel.querySelectorAll('.uw-player-tab');
                for (var ti = 0; ti < tabs.length; ti++) tabs[ti].classList.toggle('uw-player-tab--active', ti === n);
                var cnt = panel.querySelector('.uw-player-list-count');
                if (cnt) cnt.textContent = 'PLAYLIST · ' + uwActiveTracks().length + '首';
                var tr = panel.querySelector('.uw-player-track');
                if (tr) tr.textContent = '未播放';
                var sub = panel.querySelector('.uw-player-sub');
                if (sub) sub.textContent = '音乐盒 · 请选择曲目';
            }
            uwSyncPlayUi(false);
            if (autoplay !== false) uwPlayTrack(0);
        }
        function uwPlayNext() {
            if (!uwActiveTracks().length) return;
            if (uwPlayer.shuffle && uwActiveTracks().length > 1) {
                var n = uwPlayer.idx;
                while (n === uwPlayer.idx) n = Math.floor(Math.random() * uwActiveTracks().length);
                uwPlayTrack(n);
            } else {
                uwPlayTrack(uwPlayer.idx + 1);
            }
        }
        function uwToggleShuffle(btn) {
            uwPlayer.shuffle = !uwPlayer.shuffle;
            if (btn) btn.classList.toggle('uw-player-ctl--active', uwPlayer.shuffle);
        }
        function uwTogglePlay() {
            if (!uwActiveTracks().length) return;
            var a = uwAudioEl();
            if (!a.src) { uwPlayTrack(0); return; }
            if (a.paused) a.play().catch(function() {});
            else a.pause();
        }

        function uwClosePlayer() {
            var bd = document.querySelector('.uw-player-backdrop');
            if (!bd) return;
            document.removeEventListener('keydown', uwPlayerOnKey);
            bd.remove();
            if (uwPlayer.opener && uwPlayer.opener.focus) uwPlayer.opener.focus();
        }

        function uwPlayerOnKey(e) {
            if (e.key === 'Escape') uwClosePlayer();
        }

        function uwOpenPlayer() {
            if (document.querySelector('.uw-player-backdrop')) return;
            uwPlayer.opener = document.activeElement;

            var themeEl = document.querySelector('.theme-mio, .theme-tsuru');
            var themeClass = themeEl && themeEl.classList.contains('theme-tsuru') ? 'theme-tsuru' : 'theme-mio';

            var bd = document.createElement('div');
            bd.className = 'uw-player-backdrop ' + themeClass;
            bd.setAttribute('role', 'dialog');
            bd.setAttribute('aria-label', '音乐盒');

            var panel = document.createElement('div');
            panel.className = 'uw-player';

            var head = document.createElement('div');
            head.className = 'uw-player-head';
            var title = document.createElement('span');
            title.className = 'uw-player-title';
            title.textContent = '音乐盒 · MUSIC BOX';
            var close = document.createElement('button');
            close.type = 'button';
            close.className = 'uw-player-close';
            close.setAttribute('aria-label', '关闭音乐盒');
            close.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>';
            close.addEventListener('click', uwClosePlayer);
            head.appendChild(title);
            head.appendChild(close);

            var body = document.createElement('div');
            body.className = 'uw-player-body';

            var discRow = document.createElement('div');
            discRow.className = 'uw-player-disc-row';
            var disc = document.createElement('div');
            disc.className = 'uw-player-disc';
            var discImg = document.createElement('img');
            discImg.alt = '';
            discImg.crossOrigin = 'anonymous';
            discImg.src = uwQFile(uwQState.ch, uwQState.emotion);
            disc.appendChild(discImg);
            var now = document.createElement('div');
            now.className = 'uw-player-now';
            var label = document.createElement('div');
            label.className = 'uw-player-label';
            label.textContent = 'NOW PLAYING';
            var track = document.createElement('div');
            track.className = 'uw-player-track';
            track.textContent = uwActiveTracks().length ? '未播放' : '曲库待补充';
            var sub = document.createElement('div');
            sub.className = 'uw-player-sub';
            sub.textContent = 'Q版小人 · ' + uwQState.ch;
            now.appendChild(label);
            now.appendChild(track);
            now.appendChild(sub);
            discRow.appendChild(disc);
            discRow.appendChild(now);

            var bar = document.createElement('div');
            bar.className = 'uw-player-bar';
            bar.setAttribute('aria-label', '播放进度');
            var fill = document.createElement('div');
            fill.className = 'uw-player-fill';
            bar.appendChild(fill);
            bar.addEventListener('click', function(e) {
                var a = uwPlayer.audio;
                if (!a || !a.duration) return;
                var r = bar.getBoundingClientRect();
                a.currentTime = (e.clientX - r.left) / r.width * a.duration;
            });
            var time = document.createElement('div');
            time.className = 'uw-player-time';
            time.textContent = '0:00 / 0:00';

            var controls = document.createElement('div');
            controls.className = 'uw-player-controls';
            var prev = document.createElement('button');
            prev.type = 'button';
            prev.className = 'uw-player-ctl';
            prev.setAttribute('aria-label', '上一首');
            prev.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 6h2v12H7zM20 6v12l-9-6z"></path></svg>';
            prev.addEventListener('click', function() { if (uwActiveTracks().length) uwPlayTrack(uwPlayer.idx - 1); });
            var main = document.createElement('button');
            main.type = 'button';
            main.className = 'uw-player-ctl uw-player-ctl--main';
            main.setAttribute('aria-label', '播放或暂停');
            main.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"></path></svg>';
            main.addEventListener('click', uwTogglePlay);
            var next = document.createElement('button');
            next.type = 'button';
            next.className = 'uw-player-ctl';
            next.setAttribute('aria-label', '下一首');
            next.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 6h2v12h-2zM4 6v12l9-6z"></path></svg>';
            next.addEventListener('click', function() { uwPlayNext(); });
            var shuffle = document.createElement('button');
            shuffle.type = 'button';
            shuffle.className = 'uw-player-ctl uw-player-ctl--shuffle' + (uwPlayer.shuffle ? ' uw-player-ctl--active' : '');
            shuffle.setAttribute('aria-label', '随机播放');
            shuffle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>';
            shuffle.addEventListener('click', function() { uwToggleShuffle(shuffle); });
            controls.appendChild(prev);
            controls.appendChild(main);
            controls.appendChild(next);
            controls.appendChild(shuffle);

            var volume = document.createElement('div');
            volume.className = 'uw-player-volume';
            var volIcon = document.createElement('span');
            volIcon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#888" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4z" fill="#888" stroke="none"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path></svg>';
            var range = document.createElement('input');
            range.type = 'range';
            range.min = '0';
            range.max = '100';
            range.value = '85';
            range.setAttribute('aria-label', '音量');
            range.addEventListener('input', function() {
                uwAudioEl().volume = range.value / 100;
            });
            volume.appendChild(volIcon);
            volume.appendChild(range);

            var listTitle = document.createElement('div');
            if (!UW_Q.tracks.length && UW_Q.tracksPure.length) uwPlayer.list = 1;
            listTitle.className = 'uw-player-list-title uw-player-list-fold';
            listTitle.setAttribute('role', 'button');
            listTitle.setAttribute('tabindex', '0');
            listTitle.innerHTML = '<span class="uw-player-list-count">PLAYLIST · ' + uwActiveTracks().length + '首</span><span class="uw-player-fold-arrow">▸</span>';
            listTitle.addEventListener('click', function() {
                var hidden = list.style.display === 'none';
                list.style.display = hidden ? '' : 'none';
                var ar = listTitle.querySelector('.uw-player-fold-arrow');
                if (ar) ar.textContent = hidden ? '▾' : '▸';
            });
            listTitle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); listTitle.click(); }
            });
            var list = document.createElement('ul');
            list.className = 'uw-player-list';
            list.style.display = 'none';

            body.appendChild(discRow);
            body.appendChild(bar);
            body.appendChild(time);
            body.appendChild(controls);
            body.appendChild(volume);
            if (UW_Q.tracks.length && UW_Q.tracksPure.length) {
                var tabs = document.createElement('div');
                tabs.className = 'uw-player-tabs';
                var tabNames = ['歌曲', '纯音乐'];
                for (var ti = 0; ti < 2; ti++) {
                    (function(n) {
                        var b = document.createElement('button');
                        b.type = 'button';
                        b.className = 'uw-player-tab' + (uwPlayer.list === n ? ' uw-player-tab--active' : '');
                        b.textContent = tabNames[n];
                        b.addEventListener('click', function() { uwSwitchList(n, true); });
                        tabs.appendChild(b);
                    })(ti);
                }
                body.appendChild(tabs);
            }
            body.appendChild(listTitle);
            body.appendChild(list);

            panel.appendChild(head);
            panel.appendChild(body);
            bd.appendChild(panel);

            bd.addEventListener('click', function(e) { if (e.target === bd) uwClosePlayer(); });
            document.addEventListener('keydown', uwPlayerOnKey);

            document.body.appendChild(bd);
            uwRenderPlaylist();
            var hasTracks = uwActiveTracks().length > 0;
            prev.disabled = !hasTracks;
            next.disabled = !hasTracks;
            if (!hasTracks) main.disabled = true;
            close.focus();
        }

        function init() {
            try {
                var messageText = getMessageData();
                if (!messageText) {
                    document.getElementById('content').innerHTML = '<div class="card"><div class="loading">❌ 无法获取消息内容</div></div>';
                    return;
                }
                var data = parseData(messageText);
                if (!data) {
                    document.getElementById('content').innerHTML = '<div class="card"><div class="loading">❌ 未检测到状态面板格式</div></div>';
                    return;
                }
                renderPage(data);
            } catch (error) {
                document.getElementById('content').innerHTML = '<div class="card"><div class="loading">❌ 加载失败：' + error.message + '</div></div>';
            }
        }

        $(function() { init(); });
    
window.__uwFrontBooted = true;
