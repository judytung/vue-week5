const url = 'https://vue3-course-api.hexschool.io/v2'; // 加入站點
const path = 'judyhexschoolforvue'; // 加入個人 API Path


const app = Vue.createApp({
  data () {
    return {
      cartData: {},
      products: [],
      productId: '',
      isLoadingItem: '',  // 局部讀取效果的變數，當我們點擊加入到購物車按鈕時，按鈕無法再次點擊
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
    // 取得購物車列表
    getCart () {
      axios.get(`${url}/api/${path}/cart`)
      .then (res => {
        // console.log(res);
        this.cartData = res.data.data; // data 裡有兩層，要存到最後一個 data
      })
      .catch ((err) => {
        alert(err.data.message);
      })
    },
    // 加入購物車
    addToCart (id, qty = 1) {  // 參數預設值，數量剛加進來就是一個
      // 根據 api 資料格式建構
      const data = {
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      axios.post(`${url}/api/${path}/cart`, { data }) // 這邊要將資料帶出去
      .then (res => {
        console.log(res);
        this.getCart();
        this.isLoadingItem = ''; // 讀取完清空
      })
      .catch ((err) => {
        alert(err.data.message);
      })
    },
    // 刪除購物車品項
    removeCartItem (id) {
      this.isLoadingItem = id;
      axios.delete(`${url}/api/${path}/cart/${id}`)
      .then (res => {
        alert(res.data.message);
        this.getCart();
        this.isLoadingItem = '';
      })
      .catch ((err) => {
        alert(err.data.message);
      })
    },
    // 更新購物車
    updateCart (item) {  
      // 根據 api 資料格式建構
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      axios.put(`${url}/api/${path}/cart/${item.id}`, { data }) // 這邊要將資料帶出去
      .then (res => {
        alert(res.data.message)
        this.getCart();
        this.isLoadingItem = ''; // 讀取完清空
      })
      .catch ((err) => {
        alert(err.data.message);
      })
    },
  },
  
  mounted () {
    this.getProducts ();
    this.getCart();
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