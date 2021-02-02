
import logoPng from '@/assets/logo.png'

export default {
  name: 'Layout',
  data() {
    return {
      logo: logoPng,
      childNavList: []
    }
  },
  computed: {
    navList() {
      return this.$store.state.menuList || []
    },
    route() {
      return this.$route.path.split('/')[1]
    },
    currentRoute() {
      return this.$route.path.split('/')[this.$route.path.split('/').length - 1]
    }
  },
  components: {
  },
  created() {
    if (this.$route.path.split('/')[1]) {
      let n = this.navList.find(l => l.name === this.$route.path.split('/')[1])
      if (n) {
        this.childNavList = n.children
      }
    }
  },
  methods: {
    onNavItem(i) {
      if (i === '/') {
        this.$router.push('/')
        this.childNavList = []
        return
      }
      let currentNav = this.navList[i]
      this.childNavList = currentNav.children || []
      this.$router.push(currentNav.children && currentNav.children.length ? currentNav.path + '/' + currentNav.children[0].path : '/')
    },
    onChildItem(i) {
      this.$router.push('/' + this.route + '/' + this.childNavList[i].path)
    }
  }
}
