//Add a description to the data object with the value "A pair of warm, fuzzy socks". Then display the description using an expression in an p element, underneath the h1.

Vue.component("product", {
  template: document.getElementById("product-template").innerHTML,
  data() {
    return {
      brand: "Tremendous Trade&trade;",
      product: "Socks",
      description: "A pair of warm fuzzy socks",
      href: "https://thewirecutter.com",
      onSale: true,
      details: [
        "80% cotton",
        "19% polyester",
        "1% wheat",
        "gender neutral",
        "NOT GLUTEN FREE",
      ],
      selectedVariant: 0,
      variants: [
        {
          id: 2234,
          color: "green",
          image: "../assets/vmSocks-green.png",
          btnClass: "bg-green-300 text-green-900",
          inventory: 12,
        },
        {
          id: 2235,
          color: "blue",
          image: "../assets/vmSocks-blue.png",
          btnClass: "bg-blue-300 text-blue-900",
          inventory: 0,
        },
      ],
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].id);
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
  },
  computed: {
    image() {
      return this.variants[this.selectedVariant].image;
    },
    title() {
      return this.brand + " " + this.product;
    },
    inStock() {
      return this.variants[this.selectedVariant].inventory > 0;
    },
    inventory() {
      return this.variants[this.selectedVariant].inventory;
    },
  },
});

Vue.component("product-review", {
  template: `
<form class="review-form" @submit.prevent="onSubmit">
  <p>
    <label for="name">Name:</label>
    <input type="text" id="name" v-model="name" placeholder="name">
  </p>

  <p>
    <label for="review">Review:</label>
    <textarea id="review" v-model="review"></textarea>
  </p>

  <p>
    <label for="rating">Rating:</label>
    <select id="rating" v-model.number="rating">
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>
  </p>

  <p>
    <input class="text-white bg-pink-700 shadow" type="submit" value="Submit">
  </p>

</form>`,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
    };
  },
  methods: {
    onSubmit() {
      let productReview = {
        name: this.name,
        review: this.review,
        rating: this.rating,
      };
      this.$emit("review-submitted", productReview);
      this.name = null;
      this.review = null;
      this.rating = null;
    },
  },
});

var app = new Vue({
  el: "#app",
  data: { cart: [], reviews: [] },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    addReview(productReview) {
      this.reviews.push(productReview);
    },
  },
});
