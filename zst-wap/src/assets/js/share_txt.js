export const retRound = () => {
  let newArr = [
    '地球不爆炸，我们不放假，快来帮我砍一刀吧~',
    '宇宙不重启，我们不休息，最后一刀了~',
    '风里雨里砍价这里等你~',
    '这里没有四季，只有两季，你砍就是旺季，不砍就是淡季',
    '这世上最憋屈的事情就是你不帮我砍价~',
    '你别皱眉，砍一刀就好',
    '我数到十，你再不帮我砍价，我就再数一遍~',
    '用无可撼动的决心，来撼动你帮我砍价~',
    '最重要的一刀，留给最好的你~',
    '砍价一时爽，一直砍价一直爽，快来帮我砍一刀吧~',
    '真朋友两肋插刀，麻烦你帮我砍一刀',
    '真的不能帮我砍一下吗，我都发了这么多次了~',
    '来不及解释了，快帮我砍一刀吧~',
    '是朋友就帮我砍一刀，我是真的很想要',
    '帮我砍一刀，祝你猪年大吉',
    '就差你一刀，拜托帮帮我！',
    '麻烦帮我砍一刀可以么？你最好啦~',
    '急急急，帮我砍一刀好吗',
    '帮我砍价，你得超级大红包',
    '见证友谊的时刻到了，帮我砍一刀吧~',
  ];
  let index = Math.floor((Math.random() * newArr.length));
  return newArr[index];

};

