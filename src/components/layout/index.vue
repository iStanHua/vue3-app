<template>
  <div class="page layout">
    <div class="layout-content">
      <div class="layout-nav">
        <div class="nav-logo" @click="onNavItem('/')">
          <img :src="logo">
        </div>
        <div class="nav-content">
          <div class="nav-view">
            <div class="nav-item" v-for="(item, i) in navList" :key="i" :title="item.name" :id="'driver-step-'+i"
              :class="{'nav-active':item.name===route}" @click="onNavItem(i)">
              <i class="icon" :class="['i-'+item.name]"></i>
              <!-- <span>{{item.name}}</span> -->
            </div>
          </div>
        </div>
        <!-- <div class="nav-footer">
          <div class="nav-item">
            <i class="icon i-other" title="other"></i>
            <span>other</span>
          </div>
        </div> -->
      </div>
      <div v-if="childNavList.length" class="layout-grid">
        <div class="grid-nav">
          <div class="nav-view">
            <div class="nav-item" v-for="(item, i) in childNavList" :key="i"
              :class="{'nav-active':item.path===currentRoute}" @click="onChildItem(i)">{{ item.meta.title }}</div>
          </div>
        </div>
        <router-view />
      </div>
      <router-view v-else />
    </div>
  </div>
</template>

<style lang="scss" src="./index.scss"></style>
<script src="./index.js"></script>