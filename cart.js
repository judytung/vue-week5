const url = 'https://vue3-course-api.hexschool.io/v2'; // 加入站點
const path = 'judyhexschoolforvue'; // 加入個人 API Path
// 先宣告所有會用到的工具，解構寫法
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

// defineRule 是 VeeValidate 提供的函式，用來定義規則，第一個參數是自行命名的名稱，來自於在 HTML 的 rules 命名的地方，第二個參數是內容來自哪，第二個參數就是來自上方 VeeValidateRules 宣告引入的部分
defineRule('required', required);  // 必填
defineRule('email', email);        // email 格式
defineRule('min', min);            // 最小限制字數
defineRule('max', max);            // 最大限制字數

// 引入中文
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({ // 用來做一些設定
  generateMessage: localize('zh_TW'), //啟用 locale 
});


const app = Vue.createApp({
  data () {
    return {
      cartData: {},
      products: [],
      productId: '',
      isLoadingItem: '',  // 局部讀取效果的變數，當我們點擊加入到購物車按鈕時，按鈕無法再次點擊
      user: {
        email: '',
        name: '',
        address: '',
        phone: '',
        textarea: ''
      }
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
        console.log(res);
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
        this.$refs.productModal.closeModal();
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
        product_id: item.product_id,  
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
    // 表單
    onSubmit() {
      // console.log(this.user);
     this.$refs.form.resetForm();
     this.cartData.carts = '';
     this.cartData.total = '';
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '請輸入正確的電話號碼'
    },
  },
  // 區域註冊
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  mounted () {
    this.getProducts ();
    this.getCart();
  }
});


// Modal
app.component('product-modal', {
  props: ['id'],
  template: '#userProductModal',
  data () {
    return {
      modal: {}, // 定義 modal 變數方便調用
      product: {},
      qty: 1,
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
    closeModal () {
      this.modal.hide();
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
    },
    // 因為 modal 的加入購物車是在元件內觸發的，所以這裡也要補上
    addToCart () {
      this.$emit('add-cart', this.product.id, this.qty)
    }
  },
  mounted () {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
});
app.mount('#app');