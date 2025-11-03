<script setup>

</script>

<template>
  <a-layout-content class="about-page">
    <a-card class="about-card">
      <template #title>
        <h1 class="about-title">关于 MySekaiShare 项目</h1>
      </template>
      
      <a-typography>
        <a-typography-paragraph class="intro-text">
          MySekaiShare 是一个分享世界计划(初音未来:缤纷舞台)中我的「世界」(MySEKAI)玩法图纸和ID的在线工具，玩家可自由在平台上选择已有的物品并分享自己的ID供其他玩家访问复制。
        </a-typography-paragraph>
        
        <a-typography-title :level="2">不说套话，我为什么要做这个项目</a-typography-title>
        <a-typography-paragraph>
          MySEKAI(俗称烤森)，是pjsk里在四周年之际添加的一个家园系统(这还是音游对吧)，玩家可以创造属于自己的Sekai。<br>
          如俗称所说，这个玩法非常像《集合啦，动物森友会》。不过由于是附加玩法，所以并没有动森那么肝。玩家可以用心愿(其实还是开箱子、捡树枝摘花)<br>
          然而这个玩法有个致命问题：一般图纸可以从每日的纸飞机宝箱中获取、也可以用空白图纸来临摹其他人的物品(俗称抄图纸)。谁不想让自推团的孩子们能玩到互动道具，所以大多数人选择就算空白图纸有限的情况下也要抄图纸。<br>
          问题来了：去哪抄？谁都不知道想要的物品在哪个SEKAI能抄到，到了B站上找了半天也没找到。为了找别人那一长串的ID要游戏和B站来回切，容易被杀后台不说，经常是你忙活了半天啥也没抄到。<br>
          所以，MySekaiShare诞生了。它的目的不仅仅是帮助玩家抄图纸，也可以通过MySEKAI绑定用户的特性结识到更多同好。
        </a-typography-paragraph>
        
        <a-typography-title :level="2">使用到的项目</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li><a href="https://sekai.best/" target="_blank">Sekai Viewer数据库</a></li>
            <li><a href="https://www.antdv.com/" target="_blank">Ant Design Vue</a></li>
            <li><p>DREAMERIVER江愿软件即服务SaaS - FlowerInteractive"飞花令"网站数字业务框架(专有软件)</p></li>
          </ul>
        </a-typography-paragraph>
        
        <a-typography-title :level="2">特别感谢</a-typography-title>
        <a-typography-paragraph>
          所有参与测试的老师们<br><br>
          <strong class="highlight-text">还有正在看这段关于页面的老师您</strong>
        </a-typography-paragraph>
        
<!--        <a-typography-title :level="2">开发者寄语</a-typography-title>-->
        <a-typography-paragraph class="developer-quote">
          <blockquote>
            愿中国青年都摆脱冷气，只是向上走，不必听自暴自弃者流的话。能做事的做事，能发声的发声。有一分热，发一分光，就令萤火一般，也可以在黑暗里发一点光，不必等候炬火。此后如竟没有炬火：我便是唯一的光。<br>
            <span class="quote-author">——鲁迅</span>
          </blockquote>
        </a-typography-paragraph>
      </a-typography>
    </a-card>
  </a-layout-content>
</template>

<style scoped>
.about-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.about-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.about-title {
  text-align: center;
  margin-bottom: 0;
  color: #1890ff;
}

.intro-text {
  font-size: 16px;
  line-height: 1.8;
}

.highlight-text {
  font-size: 24px;
  color: #1890ff;
  display: block;
  text-align: center;
  margin: 20px 0;
}

.developer-quote {
  background-color: #f0f8ff;
  padding: 20px;
  border-radius: 6px;
  border-left: 4px solid #1890ff;
  font-style: italic;
}

.quote-author {
  display: block;
  text-align: right;
  margin-top: 10px;
  font-weight: bold;
}

:deep(.ant-typography h2) {
  color: #0d5bad;
  margin-top: 30px;
  margin-bottom: 15px;
}

:deep(.ant-typography p) {
  line-height: 1.8;
  font-size: 15px;
}

:deep(.ant-typography ul) {
  font-size: 15px;
}

:deep(.ant-card-head) {
  border-bottom: none;
  padding: 0 16px;
}

:deep(.ant-card-head-title) {
  padding: 16px 0;
}
</style>