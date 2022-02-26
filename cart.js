const url = 'https://vue3-course-api.hexschool.io/v2'; // 加入站點
const path = 'judyhexschoolforvue'; // 加入個人 API Path


const app = Vue.createApp({
  data () {
    return {
      cartData: {

      },
      products: [],
      productId: '',
    }
  },
  methods: {
    getProducts () {
      axios.get(`${url}/api/${path}/products/all`)
      .then (res => {
        console.log(res);
        this.products = res.data.products;
      })
      .catch ((err) => {
        alert(err.data.message);
      })
    },
    openProductModal (id) {
      this.productId = id; // 這裏的 id 對應到 html product-modal 元件裡的 :id = "productId" ，productId 是外層資料定義的
      this.$refs.productModal.openModal(); // 取得 productModal 這個元件結點後使用它裡面的 openModal
    },
    getCart () {

    },
  },
  mounted () {
    this.getProducts ();
  }
});

app.component('product-modal', {
  props: ['id'],
  template: '#userProductModal',
  data () {
    return {
      modal: {}, // 定義 modal 變數方便調用
      product: {},
    }
  },
  // 監控 id 變化
  watch: {
    id () {
      this.getProduct();
    }
  },
  methods :{
    openModal () {
      this.modal.show();
    },
    getProduct () {
      axios.get(`${url}/api/${path}/product/${this.id}`)
      .then (res => {
        console.log(res);
        this.product = res.data.product;
      })
      .catch ((err) => {
        alert(err.data.message);
      })
    }
  },
  mounted () {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
});
app.mount('#app');