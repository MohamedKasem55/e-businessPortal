export class StyleColorChart{

  static colors= {
    lime50: '#F7FEE7',
    lime100: '#ECFCCB',
    lime200: '#D9F99D',
    lime300: '#BEF264',
    lime400: '#A3E635',
    lime500: '#84CC16',
    lime600: '#65A30D',
    lime700: '#4D7C0F',
    lime800: '#3F6212',
    lime900: '#365314',
    blue50: '#EFF6FF',
    blue100: '#DBEAFE',
    blue200: '#BFDBFE',
    blue300: '#93C5FD',
    blue400: '#60A5FA',
    blue500: '#3B82F6',
    blue600: '#2563EB',
    blue700: '#1D4ED8',
    blue800: '#1E40AF',
    blue900: '#1E3A8A',
    yellow50: '#FEFCE8',
    yellow100: '#FEF9C3',
    yellow200: '#FEF08A',
    yellow300: '#FDE047',
    yellow400: '#F472B6',
    yellow500: '#EAB308',
    yellow600: '#CA8A04',
    yellow700: '#A16207',
    yellow800: '#854D0E',
    yellow900: '#713F12',
    violet50: '#F5F3FF',
    violet100: '#EDE9FE',
    violet200: '#DDD6FE',
    violet300: '#C4B5FD',
    violet400: '#A78BFA',
    violet500: '#8B5CF6',
    violet600: '#7C3AED',
    violet700: '#6D28D9',
    violet800: '#5B21B6',
    violet900: '#4C1D95',
    fuchsia50: '#FDF4FF',
    fuchsia100: '#FAE8FF',
    fuchsia200: '#F5D0FE',
    fuchsia300: '#F0ABFC',
    fuchsia400: '#E879F9',
    fuchsia500: '#D946EF',
    fuchsia600: '#C026D3',
    fuchsia700: '#A21CAF',
    fuchsia800: '#86198F',
    fuchsia900: '#701A75',
    pink50: '#FDF2F8',
    pink100: '#FCE7F3',
    pink200: '#FBCFE8',
    pink300: '#F9A8D4',
    pink400: '#F472B6',
    pink500: '#EC4899',
    pink600: '#DB2777',
    pink700: '#BE185D',
    pink800: '#9D174D',
    pink900: '#831843',
    orange50: '#FFF7ED',
    orange100: '#FFEDD5',
    orange200: '#FED7AA',
    orange300: '#FDBA74',
    orange400: '#FB923C',
    orange500: '#F97316',
    orange600: '#EA580C',
    orange700: '#C2410C',
    orange800: '#9A3412',
    orange900: '#7C2D12',
  }


  static primaryColor= 'rgba(0, 56, 255, 1)';
  static primaryLogo= 'rgba(34, 26, 251, 1)';
  static secondaryColor= 'rgba(239, 246, 255, 1)';
  static primaryDisable= 'rgba(248, 248, 248, 1)';
  static primaryText= 'rgba(39, 36, 36, 1)';
  static secondaryText= 'rgba(114, 120, 142, 1)';
  static tertiaryText= 'rgba(188, 198, 219, 1)';
  static disableText= 'rgba(203, 210, 217, 1)';
  static supportText= 'rgba(255, 255, 255, 1)';
  static primaryCard= 'rgba(247, 248, 250, 1)';
  static secondaryCard= 'rgba(255, 255, 255, 1)';
  static outlineColor= 'rgba(230, 233, 239, 1)';
  static tabNavBG= 'rgba(255, 255, 255, 1)';
  static primaryBG= 'rgba(253, 253, 253, 1)';
  static positiveText= 'rgba(32, 201, 146, 1)';
  static positiveBG= 'rgba(234, 249, 241, 1)';
  static warningText= 'rgba(254, 158, 70, 1)';
  static warningBG= 'rgba(251, 241, 224, 1)';
  static negativeText= 'rgba(252, 85, 85, 1)';
  static negativeBg= 'rgba(254, 226, 226, 1)';
  static primaryHover= 'rgba(0, 81, 255, 1)';
  static secondaryHover= 'rgba(227, 234, 242, 1)';
  static skeleton= 'rgba(237, 240, 248, 1)';
  static overly= 'rgba(181, 183, 192, 1)';
  static alternating= 'rgba(238, 240, 242, 1)';
  static transparent= 'rgba(240, 255, 255, 0)'


  static  hexToRgb(hex:string):string {

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if( result) {
      let r= parseInt(result[1], 16);
      let g= parseInt(result[2], 16);
      let b= parseInt(result[3], 16);
      return "rgb("+r+","+g+","+b+")";
    }
      return '';
  }
}
