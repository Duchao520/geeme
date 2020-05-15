<template>
  <div>
    <!--标题栏-->
    <header class="bg-f">
      <h3 class="border-buttom ">在线购卡</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
      <span class="icon fc-r fz16">提交</span>
    </header>
    <div style="height: 44px;"></div>
    <!---->
    <div class="bg-f mb-5 pd-lr-10 pd-tb-5">
      <p class="fz15 title">文案内容</p>
      <textarea rows="3" class="fz14" placeholder="请输入文案，如公司slogen(助商通让你的生意更好做可用于通话页,banner，定制卡)"></textarea>
    </div>
    <!--上传图片-->
    <div class=" bg-f box">
      <div class="clearfix">
        <div class="fl-l img-box relative">
          <input type="file"/>
          <span class="ico-add"></span>
        </div>
        <div class="fl-r">
          <textarea placeholder="请输入图片说明" rows="2" class="fz14"></textarea>
        </div>
      </div>
      <!--新增-->
      <div class="new">
        <div class="ico-add"></div>
        <p class="fc-c fz12">(注：最多添加9张图片素材)</p>
      </div>
    </div>
    <div class="fc-r fz12 pd-lr-10 pd-tb-5">
      <p class="fz14">素材说明：</p>
      <p>提供的素材用于设置定制卡卡面，应用内首页的广告轮播图和通话背景大图</p>
      <p></p>
      <p>建议：首页轮播图(最多4张) 通话背景图(1张全屏大图)</p>
    </div>
  </div>
</template>

<script>
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  .icon {
    line-height: 45px;
  }

  .title {
    line-height: 40px;
  }

  textarea {
    width: 100%;
  }

  .img-box {
    padding: 3px;
    height: 112px;
    width: 112px;
    border: 1px solid #d8dce7;
  }

  .img-box .ico-add {
    display: block;
    width: 100%;
    height: 100%;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA9BAMAAADsTHzaAAAAG1BMVEUAAACapMGapMGapMGapMGapMGapMGapMGapMGICMXtAAAACXRSTlMAgD9wKGB4HlfEbZenAAAARUlEQVQ4y2NABW1pSQz4QKCg0Kj8qPyoPNHyLC7IwFBQAoXvwFAoiA8I0Fy+2BgZJAqKofANBjz8RuVH5UeOvJOSOqoAAElCMXXlfNG7AAAAAElFTkSuQmCC) no-repeat center;
    background-size: 30px;
  }

  .img-box input[type='file'] {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
  }

  .box {
    padding: 20px 30px 50px;
  }

  .new {
    text-align: center;
  }

  .new .ico-add {
    display: inline-block;
    width: 40px;
    height: 18px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAlBAMAAAAn0HPsAAAALVBMVEUAAADh5Ovh5Ovh5Ovh5Ovh5Ovh5Ovh5Ovh5Ovh5Ovh5Ovh5Ovh5Ov////v8fRIESchAAAADHRSTlMA8o6e4bymWUwrGQmBSmZPAAAAvklEQVQ4y42UKw7CUBBFb1LR4FFQi6uoReKr0KyAVHQfIEhYAQaPw7YpDWKWQNkBe0C8Epp+z9Enk7w3d64c99XGeplvD2pwDmyQbP33rjbKXjV+MC5mqRyhTZA7z7NJot9ANNI3QCrpQsSFpISIpTSzDtXbOpzkMTHSjYlLHZn4VMjEXDsmPhQzsVArOZ+q5tVKkIyJxifGTCzwq/E/4s3gXeP08DwqIWKJbwZfIb1r3BS0e3ib8X7kjYs7/AuJVyP5JAsrnwAAAABJRU5ErkJggg==) no-repeat center;
    background-size: cover;
  }
</style>
