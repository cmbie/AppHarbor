// BACKEND INTEGRATION: replace this static catalog with fetch('/data/apps.json') or a shared API.
export type PlatformKind = 'Windows' | 'macOS' | 'Android' | 'Linux' | 'Web' | 'iOS';
export type LinkStatus = 'reachable' | 'unverifiable' | 'broken' | 'unchecked';

export interface DownloadSource {
    id: string;
    platform: PlatformKind;
    url: string;
    fileName: string;
    fileSize: string;
    fileType: string;
    checksum: string | null;
    linkStatus: LinkStatus;
}

export interface AppVersion {
    id: string;
    version: string;
    releaseDate: string;
    releaseNotes: string;
    isLatest: boolean;
    sources: DownloadSource[];
}

export interface Screenshot {
    id: string;
    url: string;
    alt: string;
    caption: string;
}

export interface CatalogApp {
    id: string;
    type: 'app' | 'game';
    name: string;
    subtitle: string;
    developer: string;
    developerWebsite: string;
    category: string;
    price: number;
    priceLabel: string;
    description: string;
    features: string[];
    icon: string;
    iconAlt: string;
    banner: string;
    bannerAlt: string;
    screenshots: Screenshot[];
    currentVersion: string;
    releaseDate: string;
    lastUpdated: string;
    changelog: string;
    fileSize: string;
    supportedOS: string[];
    minimumRequirements: string;
    languages: string[];
    ageRating: string;
    privacyPolicyUrl: string;
    supportUrl: string;
    tags: string[];
    versions: AppVersion[];
    similarIds: string[];
    isAppOfDay: boolean;
    isGameOfDay: boolean;
    featured: boolean;
    downloadable: boolean;
}

export interface CatalogCategory {
    id: string;
    name: string;
    type: 'app' | 'game';
    description: string;
}

export interface CatalogCollection {
    id: string;
    title: string;
    description: string;
    cover: string;
    coverAlt: string;
    appIds: string[];
    visible: boolean;
}

export const categories: CatalogCategory[] = [
    { id: 'cat-productivity', name: 'Productivity', type: 'app', description: 'Plan, write and get things done.' },
    { id: 'cat-education', name: 'Education', type: 'app', description: 'Study aids and learning tools.' },
    { id: 'cat-utilities', name: 'Utilities', type: 'app', description: 'Small tools that solve one job well.' },
    { id: 'cat-devtools', name: 'Developer Tools', type: 'app', description: 'Editors, inspectors and build helpers.' },
    { id: 'cat-art', name: 'Art and Design', type: 'app', description: 'Draw, lay out and create.' },
    { id: 'cat-puzzle', name: 'Puzzle', type: 'game', description: 'Think it through.' },
    { id: 'cat-arcade', name: 'Arcade', type: 'game', description: 'Quick sessions, sharp reflexes.' },
    { id: 'cat-strategy', name: 'Strategy', type: 'game', description: 'Plan several moves ahead.' },
    { id: 'cat-edu-games', name: 'Educational', type: 'game', description: 'Learn while you play.' }];


export const apps: CatalogApp[] = [
    {
        id: 'mathverse',
        type: 'app',
        name: 'MathVerse',
        subtitle: 'Math-learning designed to make more fun and interactive.',
        developer: 'James Damasco',
        developerWebsite: 'https://cmbie.netlify.app/',
        category: 'Game',
        price: 0,
        priceLabel: 'FREE',
        description:
            'Mathverse is a math-learning designed to make learning more fun and interactive. It combines math challenges, game features, and rewards to help students practice their skills.',
        features: ['Different Game Modes', 'Daily Missions', 'Leveling System', 'Progressive Tracking'],
        icon: "/icons/2.png",
        iconAlt: 'MathVerse Icon',
        banner: "/banner/mathverse-banner.png",
        bannerAlt: 'MathVerse Banner',
        screenshots: [
            { id: 'mathverse-s1', url: "/screenshot/MathVerse/1.jpg", alt: 'MathVerse Homepage', caption: 'MathVerse Start Menu' },
            { id: 'mathverse-s2', url: "/screenshot/MathVerse/2.jpg", alt: 'MathVerse Arena Page', caption: 'MathVerse Start Arena' },
            { id: 'mathverse-s3', url: "/screenshot/Mathverse/3.jpg", alt: 'MathVerse Edit Profile', caption: 'MathVerse Edit Profile' }],

        currentVersion: '2.4.1',
        releaseDate: '2026-07-14',
        lastUpdated: '2026-10-02',
        changelog: 'Fixed a crashed app',
        fileSize: '32.2 MB',
        supportedOS: ['Android 9', "Android 10", "Android 11"],
        minimumRequirements: '4 GB RAM, 200 MB free disk space',
        languages: ['English'],
        ageRating: '4+',
        privacyPolicyUrl: '/privacy/mathverse/privacy.html',
        supportUrl: '/privacy/mathverse/terms-and-conditions',
        tags: ['productivity', 'student', 'online', 'educational'],
        versions: [
            {
                id: 'mathverse-2.0', version: '2.0', releaseDate: '2026-10-23', isLatest: true,
                releaseNotes: 'Fixed a crash and bugs.',
                sources: [
                    { id: 'mv-20.exe', platform: 'Windows', url: '/downloads/exe', fileName: 'soon', fileSize: '48.2 MB', fileType: 'exe', checksum: null, linkStatus: 'unchecked' },
                    { id: 'mv-20-apk', platform: 'Android', url: 'https://kul-ddata.terabox.com/file/742a69031774363431f0368a4c38d3ff?bkt=en-2e2b5030dd6ff0379c16ab7335775d4439a12c7a6c010e96e4b59b5d25404495a3c606b1e41b6fc8&fid=4401396700575-250528-296978097824291&time=1793362678&sign=FDTAXUGERLQlBHSKfWon-DCb740ccc5511e5e8fedcff06b081203-GXqG2hh8lvsD1D8R6kUfX1lPcUI%3D&to=153&size=33043824&sta_dx=33043824&sta_cs=0&sta_ft=apk&sta_ct=0&sta_mt=0&fm2=MH%2Ckul%2CAnywhere%2C%2CUml6YWw%3D%2CRE5TbmV0d29ya3MgQ29ycG9yYXRpb24%3D&region=kul&ctime=1793362662&mtime=1793362662&resv0=-1&resv1=0&resv2=&resv3=&resv4=33043824&vuk=4401396700575&iv=0&htype=&randtype=&newver=1&newfm=1&secfm=1&flow_ver=3&pkey=en-2b2d17e019bb13f32d03f40bef12db9c865f51b13dbeddbbff26b11a4ce2d82888d247f2b7c67453&sl=68091977&expires=1793391478&rt=pr&r=655085523&fin=MathVerse+2.0.apk&fn=MathVerse+2.0.apk&dp-logid=106320439744113478&dp-callid=0.1&hps=1&tsl=2000&csl=2000&fsl=-1&csign=2f1ey7Ygk9%2FjHBmFuuoQ6jABSWs%3D&so=0&ut=6&uter=4&uc=107934675&ti=9c74a385a1d3afc5bd4c67ac155ce5889e36be6ac4205b02305a5e1275657320&tuse=&raw_appid=0&ogr=0&rregion=VF9V&adg=c_07e8a414c076724b9e99379d6197ed4c&reqlabel=250528_f_dbfed255badd01920e3cfa86d6cf8744_-1_59a99ca53d36e13e22e11395e4765cc8&ccn=PH&by=themis', fileName: 'mathverse-2.0.apk', fileSize: '32.2 MB', fileType: 'apk', checksum: null, linkStatus: 'unchecked' }]
            }],
        similarIds: ['study', 'educational'],
        isAppOfDay: true, isGameOfDay: false, featured: true, downloadable: true
    },
    {
        id: 'tetris',
        type: 'app',
        name: 'Tetris',
        subtitle: 'Stack, Clear, Compete — The Ultimate Tetris Challenge!',
        developer: 'James Damasco',
        developerWebsite: 'cmbie.netlify.app',
        category: 'Game',
        price: 0,
        priceLabel: 'FREE',
        description: '',
        features: ["Multiple Game Modes", "Multiplayer System", "Private Rooms", "Global Leaderboards", "Advanced Controls", "Customizable Settings", "Live Game Statistics", "Spectator Mode"],
        icon: "/icons/5.png",
        iconAlt: 'Colorful falling puzzle blocks arranged in a Tetris-style design, representing a classic block-stacking game.',
        banner: "/banner/tetris-banner.jpg",
        bannerAlt: 'Competitive Tetris gaming banner featuring colorful falling blocks, puzzle gameplay, and a modern arcade-inspired design.',
        screenshots: [
            { id: 'tetris-s1', url: "/screenshot/Tetris/1.jpg", alt: 'Tetris Home Page', caption: 'Tetris Game Menu' },
            { id: 'tetris-s2', url: '/screenshot/Tetris/2.jpg', alt: 'Tetris Player', caption: 'Tetris Select Player' },
            { id: 'tetris-s3', url: '/screenshot/Tetris/3.jpg', alt: 'Tetris Play', caption: 'Tetris Game Play' }],

        currentVersion: '1.0.0',
        releaseDate: '2025-09-05',
        lastUpdated: '2026-09-21',
        changelog: 'I have temporarily removed the multiplayer system, private rooms, global leaderboard, spectator mode, guest mode, as well as the login and registration features. It remains in the beta test phase.',
        fileSize: '32.4MB',
        supportedOS: ['Web', 'Windows 10+'],
        minimumRequirements: 'Any modern browser',
        languages: ['English'],
        ageRating: '4+',
        privacyPolicyUrl: '/privacy/tetris/privacy-policy',
        supportUrl: '/privacy/tetris/support',
        tags: ['Tetris', 'Puzzle', 'Multiplayer', 'Arcade', 'Competitive', 'Strategy', 'Block Puzzle', 'Brain Training'],
        versions: [
            {
                id: 'tetris-v100', version: '1.0.2', releaseDate: '2026-09-21', isLatest: true,
                releaseNotes: 'Initial release featuring classic Tetris gameplay, multiple game modes, competitive multiplayer, private rooms, global leaderboards, and customizable settings.',
                sources: [
                    { id: 'tetris-v100-web', platform: 'Web', url: 'https://tetris-multi.netlify.app/', fileName: 'tetris-v100', fileSize: '', fileType: 'Web', checksum: null, linkStatus: 'unchecked' }]

            }],

        similarIds: ['mathverse'],
        isAppOfDay: false, isGameOfDay: false, featured: true, downloadable: false
    },
    {
        id: 'mystery-of-the-abandoned',
        type: 'app',
        name: 'Mystery of the Abandoned School',
        subtitle: 'Some Doors Should Never Be Opened.',
        developer: 'James Damasco',
        developerWebsite: 'cmbie.netlify.app',
        category: 'Game',
        price: 0,
        priceLabel: 'FREE',
        description: 'Mystery of the Abandoned School is an interactive mystery adventure where players investigate a forgotten school, uncover hidden secrets, solve mysteries, and make choices that shape the story. Explore different chapters, discover multiple endings, unlock achievements, and reveal the truth behind the abandoned school.',
        features: ['Interactive Story', '10 Chapters', '8 Multiple Endings', '20 Achievements', 'Character System', 'Choice-Based Gameplay', 'Mystery Exploration'],
        icon: "/icons/1.png",
        iconAlt: 'Mystery of the Abandoned School - An eerie abandoned school-themed game icon representing mystery and suspense.',
        banner: "/banner/mystery-of-the-abandoned-school.jpg",
        bannerAlt: 'Mystery of the Abandoned School - A mysterious abandoned school atmosphere featuring dark hallways, forgotten classrooms, and hidden secrets.',
        screenshots: [
            { id: 'moftas-s1', url: "/screenshot/Mystery of The Abandoned/3.jpg", alt: 'Mystery of the Abandoned School Gameplay', caption: 'Mystery of the Abandoned School gameplay' }],

        currentVersion: '1.0.0',
        releaseDate: '2026-09-20',
        lastUpdated: '2026-10-11',
        changelog: 'Initial release featuring 10 story chapters, 8 possible endings, 20 achievements, interactive storytelling, and choice-based gameplay.',
        fileSize: '31.5 MB',
        supportedOS: ['Windows 10+', 'macOS 12+', 'Android 9+',],
        minimumRequirements: '8 GB RAM, GPU with OpenGL 3.3',
        languages: ['English'],
        ageRating: '16+',
        privacyPolicyUrl: '/privacy/moftas/privacy-polivy',
        supportUrl: '/privacy/moftas/support',
        tags: ['Mystery', 'Adventure', 'Interactive Story', 'Horror', 'Puzzle', 'Logic', 'Choices', 'Investigatons'],
        versions: [
            {
                id: 'moftas-v102', version: '1.0.2', releaseDate: '2026-10-11', isLatest: true,
                releaseNotes: 'Initial release featuring 10 story chapters, 8 possible endings, 20 achievements, interactive storytelling, and choice-based gameplay.',
                sources: [
                    { id: 'moftas-102-win', platform: 'Windows', url: '/download/exe', fileName: 'moftas-1.0.2-setup.exe', fileSize: '96.5 MB', fileType: 'exe', checksum: null, linkStatus: 'unverifiable' },
                    { id: "moftas-102-apk", platform: "Android", url: "https://kul-ddata.terabox.com/file/763a7baaed3f8f8b3eeddd93cfdb72c5?bkt=en-c58a217c5b5bf7b2bf98187f3ddd68693cb16ced93b9fcb1878c24ec57e4165f6e6ffda6ccaab719&fid=4401396700575-250528-538132390804086&time=1793362752&sign=FDTAXUGERLQlBHSKfWon-DCb740ccc5511e5e8fedcff06b081203-1x2VKQrXxozoah1WfithPAftFWk%3D&to=153&size=33056112&sta_dx=33056112&sta_cs=0&sta_ft=apk&sta_ct=0&sta_mt=0&fm2=MH%2Ckul%2CAnywhere%2C%2CUml6YWw%3D%2CRE5TbmV0d29ya3MgQ29ycG9yYXRpb24%3D&region=kul&ctime=1793362747&mtime=1793362747&resv0=-1&resv1=0&resv2=&resv3=&resv4=33056112&vuk=4401396700575&iv=0&htype=&randtype=&newver=1&newfm=1&secfm=1&flow_ver=3&pkey=en-916838cf5367cee3cfcc9f3be3a9f507b943c31fdb027549923b928fed076ab9dafddf2f543756e3&sl=68091977&expires=1793391552&rt=pr&r=854524055&fin=Mystery+of+the+Abandoned+School.apk&fn=Mystery+of+the+Abandoned+School.apk&dp-logid=106340319693215767&dp-callid=0.1&hps=1&tsl=2000&csl=2000&fsl=-1&csign=2f1ey7Ygk9%2FjHBmFuuoQ6jABSWs%3D&so=0&ut=6&uter=4&uc=107934675&ti=9c74a385a1d3afc5841eb81565e65dc77f79292e531b4be0305a5e1275657320&tuse=&raw_appid=0&ogr=0&rregion=VF9V&adg=c_07e8a414c076724b9e99379d6197ed4c&reqlabel=250528_f_dbfed255badd01920e3cfa86d6cf8744_-1_59a99ca53d36e13e22e11395e4765cc8&ccn=PH&by=themis", fileName: 'Mystery-Of-The-Abandoned-School.apk', 'fileSize': '31.5MB', fileType: "apk", checksum: null, linkStatus: 'reachable' }]

            }],

        similarIds: ['mathverse', 'tetris'],
        isAppOfDay: true, isGameOfDay: false, featured: false, downloadable: true
    },
    {
        id: 'one-stroke-puzzle',
        type: 'game',
        name: 'One Stroke Puzzle',
        subtitle: 'One Path. No Lifting. Think Before You Draw!',
        developer: 'James Damasco',
        developerWebsite: 'cmbie.netlify.app',
        category: 'Puzzle',
        price: 0,
        priceLabel: 'FREE',
        description: 'ONE STROKE PUZZLE is a fun and challenging brain-training game where players must connect all the dots using a single continuous line without lifting their finger or retracing their path. Test your logic, improve your problem-solving skills, and complete hundreds of puzzles as you progress through increasingly challenging levels.',
        features: ['1000 Campaign Levels', 'Infinite Mode', 'Hint System', 'Undo & Restart', 'Level Progression', 'Coins & Rewards', 'Game Statistics', 'Dark Theme'],
        icon: "/icons/6.png",
        iconAlt: 'ONE STROKE PUZZLE - A minimalist puzzle icon featuring connected dots and a continuous line.',
        banner: "/banner/one-stroke-puzzle-banner.jpg",
        bannerAlt: 'ONE STROKE PUZZLE - A colorful brain-training puzzle banner featuring connected dots, geometric paths, and one-stroke challenges.',
        screenshots: [
            { id: 'onestrokepuzzle-s1', url: "/screenshot/One Stroke Puzzles/3.jpg", alt: 'One Stroke Puzzle board with highlighted cells', caption: 'A mid-solve puzzle board' }],
        currentVersion: '1.0.0',
        releaseDate: '2026-02-14',
        lastUpdated: '2026-10-15',
        changelog: 'Added more levels',
        fileSize: '32.2 MB',
        supportedOS: ['Android 8+', 'Windows 10+', 'Web'],
        minimumRequirements: '2 GB RAM',
        languages: ['English'],
        ageRating: '4+',
        privacyPolicyUrl: '/privacy/one-stroke-puzzle/privacy',
        supportUrl: '/privacy/one-stroke-puzze/support',
        tags: ['games', 'online', 'puzzle', "brain training", "logic", "strategy", "casual", "problem solving"],
        versions: [
            {
                id: 'osp-v100', version: '1.0.0', releaseDate: '2026-10-15', isLatest: true,
                releaseNotes: 'Added more levels.',
                sources: [
                    { id: 'osp-125-apk', platform: 'Android', url: ' https://kul-ddata.terabox.com/file/6517e48020d520585a95e70cd320445e?bkt=en-2bd419aa17f4904f67becde040940f27c83db342cff7d0c088bd5f4c8420443bda989e301eb6dac7&fid=4401396700575-250528-706842483383717&time=1793362834&sign=FDTAXUGERLQlBHSKfWon-DCb740ccc5511e5e8fedcff06b081203-UQJtLF9hCsxxmrPCNmfij9X4%2BSc%3D&to=153&size=33732862&sta_dx=33732862&sta_cs=0&sta_ft=apk&sta_ct=0&sta_mt=0&fm2=MH%2Ckul%2CAnywhere%2C%2CUml6YWw%3D%2CRE5TbmV0d29ya3MgQ29ycG9yYXRpb24%3D&region=kul&ctime=1793362809&mtime=1793362809&resv0=-1&resv1=0&resv2=&resv3=&resv4=33732862&vuk=4401396700575&iv=0&htype=&randtype=&newver=1&newfm=1&secfm=1&flow_ver=3&pkey=en-ddb560caad2ad9d9ed4542f3ad4c01a56cf2bad4fef8831aacce1ae6ac64dd140d91f85c7043dbb7&sl=68091977&expires=1793391634&rt=pr&r=989736225&fin=One+Stroke+Puzzles.apk&fn=One+Stroke+Puzzles.apk&dp-logid=106362189527617821&dp-callid=0.1&hps=1&tsl=2000&csl=2000&fsl=-1&csign=2f1ey7Ygk9%2FjHBmFuuoQ6jABSWs%3D&so=0&ut=6&uter=4&uc=107934675&ti=9c74a385a1d3afc567286e2397488872afa8a7653a182b39305a5e1275657320&tuse=&raw_appid=0&ogr=0&rregion=VF9V&adg=c_07e8a414c076724b9e99379d6197ed4c&reqlabel=250528_f_dbfed255badd01920e3cfa86d6cf8744_-1_59a99ca53d36e13e22e11395e4765cc8&ccn=PH&by=themis', fileName: 'osp-1.0.0.apk', fileSize: '32.2 MB', fileType: 'apk', checksum: null, linkStatus: 'unchecked' },
                    { id: 'osp-125-web', platform: 'Web', url: '/downloads/exe', fileName: 'osp-1.0.0-web.zip', fileSize: '32.2 MB', fileType: 'zip', checksum: null, linkStatus: 'unchecked' }]

            }],

        similarIds: ['mathverse'],
        isAppOfDay: false, isGameOfDay: true, featured: true, downloadable: true
    },
    {
        id: 'guitartunerph',
        type: 'app',
        name: 'String Sync',
        subtitle: 'Tune Your Strings. Find Your Rhythm. Play in Harmony.',
        developer: 'James Damasco',
        developerWebsite: 'cmbie.netlify.app',
        category: 'Educational',
        price: 2.99,
        priceLabel: '$2.99',
        description: 'StringSync is an all-in-one music utility app designed to help musicians tune their instruments, practice their rhythm, and explore different chords. It supports guitar, bass, and ukulele, offering accurate tuning tools, a customizable metronome, chord references, and adjustable audio settings. Perfect for beginners and experienced musicians who want a convenient music companion.',
        features: ['Instrument Tuner', 'Multiple Tuning Modes', 'Custom Tuning Settings', 'Metronome', 'Chord Library', 'Reference Tone', 'Audio Settings'],
        icon: "/icons/3.png",
        iconAlt: 'StringSync – A modern music tuner icon featuring guitar strings and musical elements.',
        banner: "/banner/string-sync-banner.jpg",
        bannerAlt: 'StringSync – A professional music utility interface featuring a digital instrument tuner, guitar strings, metronome, and chord tools.',
        screenshots: [
            { id: 'stringsync-s1', url: "/screenshot/Guitar Tuner PH/4.jpg", alt: 'Library', caption: 'Chords Library' }],

        currentVersion: '1.0.0',
        releaseDate: '2026-07-01',
        lastUpdated: '2026-09-30',
        changelog: 'Added instrument tuning, multiple tuning modes, metronome, chord library, and improved audio performance.',
        fileSize: '31.7 MB',
        supportedOS: ['Android 8+'],
        minimumRequirements: '2 GB RAM',
        languages: ['English'],
        ageRating: '16+',
        privacyPolicyUrl: '/privacy/string-sync/privacy',
        supportUrl: '/privacy/string-sync/support',
        tags: ['education', 'student'],
        versions: [
            {
                id: 'stringsync-v100', version: '1.0.0', releaseDate: '2026-09-30', isLatest: true,
                releaseNotes: 'Initial release featuring instrument tuning, multiple tuning modes, customizable metronome, chord library, reference tones, and audio settings.',
                sources: [
                    { id: 'ss-093-apk', platform: 'Android', url: 'https://kul-ddata.terabox.com/file/332b5d1f84be9e32f374b535b4102ece?bkt=en-29a7ad5d1913bc6fbc42251de0d00b2fe2b69e45a4563d6efa875f9de96823f5f34bf232a29e8119&fid=4401396700575-250528-544152833312270&time=1793362557&sign=FDTAXUGERLQlBHSKfWon-DCb740ccc5511e5e8fedcff06b081203-%2Bll5mvun%2BnRjO1Jg7SufNOsiETM%3D&to=153&size=33260912&sta_dx=33260912&sta_cs=0&sta_ft=apk&sta_ct=0&sta_mt=0&fm2=MH%2Ckul%2CAnywhere%2C%2CUml6YWw%3D%2CRE5TbmV0d29ya3MgQ29ycG9yYXRpb24%3D&region=kul&ctime=1793362539&mtime=1793362539&resv0=-1&resv1=0&resv2=&resv3=&resv4=33260912&vuk=4401396700575&iv=0&htype=&randtype=&newver=1&newfm=1&secfm=1&flow_ver=3&pkey=en-3a37af9b7d34856cb259eebe01cfd0f8a3a2453d83f51e333652efd1704fc5f40253936d5f7b3262&sl=68091977&expires=1793391357&rt=pr&r=603814972&fin=Guitar+Tuner+PH.apk&fn=Guitar+Tuner+PH.apk&dp-logid=106287864735452651&dp-callid=0.1&hps=1&tsl=2000&csl=2000&fsl=-1&csign=2f1ey7Ygk9%2FjHBmFuuoQ6jABSWs%3D&so=0&ut=6&uter=4&uc=107934675&ti=9c74a385a1d3afc5841eb81565e65dc757770542352cdaf8305a5e1275657320&tuse=&raw_appid=0&ogr=0&rregion=VF9V&adg=c_07e8a414c076724b9e99379d6197ed4c&reqlabel=250528_f_dbfed255badd01920e3cfa86d6cf8744_-1_59a99ca53d36e13e22e11395e4765cc8&ccn=PH&by=themis', fileName: 'stringsync-1.0.0.apk', fileSize: '31.7 MB', fileType: 'apk', checksum: null, linkStatus: 'broken' }]

            }],

        similarIds: [''],
        isAppOfDay: false, isGameOfDay: false, featured: false, downloadable: false
    },
]

export const collections: CatalogCollection[] = [
    {
        id: 'col-students', title: 'Best for Students',
        description: 'Planners, notes and learning games that work offline.',
        cover: "https://img.rocket.new/generatedImages/rocket_gen_img_12780ce96-1780066708201.png",
        coverAlt: 'Open books and a laptop on a study desk',
        appIds: ['studyplan', 'notecraft', 'wordtide'], visible: true
    },
    {
        id: 'col-offline', title: 'Offline Essentials',
        description: 'No connection needed once downloaded.',
        cover: "https://images.unsplash.com/photo-1577956239428-6ff017bd3904",
        coverAlt: 'Desk with notebook and planner',
        appIds: ['notecraft', 'logicgrid', 'studyplan'], visible: true
    },
    {
        id: 'col-creative', title: 'Make Something',
        description: 'Tools for sketching, building and inspecting.',
        cover: "https://images.unsplash.com/photo-1627130609035-9adb75924108",
        coverAlt: 'Paint palette and brushes',
        appIds: ['sketchpad', 'bytebench'], visible: true
    }];


export const searchTrending: string[] = ['notes', 'planner', 'puzzle offline', 'json'];

export function getApp(id: string | null | undefined): CatalogApp | undefined {
    if (!id) return undefined;
    return apps.find((a) => a.id === id);
}

export function sortByUpdated(list: CatalogApp[]): CatalogApp[] {
    return [...list].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
}

export function sortByRelease(list: CatalogApp[]): CatalogApp[] {
    return [...list].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
}

export function platformLabel(fileType: string, platform: PlatformKind): string {
    const t = fileType.toLowerCase();
    if (t === 'apk') return 'Android package';
    if (t === 'exe' || t === 'msi') return 'Windows package';
    if (t === 'zip') return platform === 'Web' ? 'Web application archive' : 'Archive';
    if (t === 'ipa') return 'iOS package (not installable directly from a website)';
    if (t === 'dmg' || t === 'pkg') return 'macOS package';
    return 'Application package';
}