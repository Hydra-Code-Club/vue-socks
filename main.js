Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>
    `
});
Vue.component('product-review', {
    template: `
      <form class="review-form" @submit.prevent="onSubmit">
        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name" placeholder="name">
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

        <p v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>
        <p>
          <input type="submit" value="Submit">
        </p>
      </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (!this.name || !this.review || !this.rating) {
                this.errors = []
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                return;
            }
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating
            }
            this.$emit('review-submitted', productReview)
            this.name = null;
            this.review = null;
            this.rating = null;
        }
    }
})
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        },
        cart: {
            type: Number,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image" v-bind:alt="altText" />
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p>{{ description }}</p>
                <p v-if="inStock">In Stock</p>
                <p v-else>Out of Stock</p>
                <p v-show="onSale">On sale!</p>
                <p>Sizes: <span v-for="size in sizes">{{ size + " " }}</span></p>
                <product-details :details="details"></product-details>
                <div class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor: variant.variantColor, width: '100px' }"
                    @mouseover="updateProduct(index)"
                >
                &nbsp;
                </div>
                <p>Shipping: {{ shipping }}</p>
                <p><a :href="url">More information.</a></p>
                <div>
                  <h2>Reviews</h2>
                  <p v-if="!reviews.length">There are no reviews yet.</p>
                  <ul>
                    <li v-for="review in reviews">
                      <p>{{ review.name }}</p>
                      <p>Rating: {{ review.rating }}</p>
                      <p>{{ review. review }}</p>
                    </li>
                  </ul>
                </div>
                <product-review @review-submitted="addReview"></product-review>
            </div>
            <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
            <button v-on:click="removeFromCart" :disabled="cart.indexOf(selectedVariantId) === -1" :class="{ disabledButton: cart.indexOf(selectedVariantId) === -1 }">Remove from cart</button>
            <button @click="emptyCart" :disabled="cart.length < 1" :class="{ disabledButton: cart < 1 }">Empty cart</button>
        </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            description: "A pair of warm, fuzzy socks.",
            selectedVariant: 0,
            altText: "A pair of socks",
            url: "https://dimenovels.org",
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            reviews: [],
            sizes: ["small", "medium", "terrifying"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/vmSocks-green.png",
                    variantQuantity: 10,
                    onSale: false,
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/vmSocks-blue.png",
                    variantQuantity: 0,
                    onSale: false,
                }
            ]
        }
    },
    computed: {
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        onSale() {
            return this.variants[this.selectedVariant].onSale;
        },
        selectedVariantId() {
            return this.variants[this.selectedVariant].variantId;
        },
        shipping() {
            return this.premium ? "Free" : 2.99;
        },
        title() {
            return this.brand + ' ' + this.product;
        }
    },
    methods: {
        addReview(productReview) {
            this.reviews.push(productReview)
        },
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        emptyCart() {
            this.$emit('empty-cart')
        },
        updateProduct(index) {
            this.selectedVariant = index
        }
    }
})
var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeFromCart(id) {
            this.cart.splice(this.cart.indexOf(id), 1);
        },
        emptyCart() {
            this.cart = [];
        }
    }
})
