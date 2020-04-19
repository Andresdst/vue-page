var eventBus = new Vue();

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
      <div class="product">
        <div class="product-image">
          <img v-bind:src="image" />
        </div>

        <div class="product-info">
          <h1>{{ title }}</h1>
          <p v-if="inStock">In Stock</p>
          <p v-else>Out of Stock</p>

          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>

          <div
            class="color-box"
            v-for="(variant, index) in variants"
            :key="variant.variantId"
            :style="{ backgroundColor: variant.variantColor }"
            @click="updateProduct(index)"
          ></div>
          <p> Shipping: {{ shipping }}</p>
          <button
            v-on:click="addToCart()"
            :disabled="!inStock"
            :class="{ disabledButton: !inStock }"
          >
            Add to cart
          </button>
        </div>
        
       <p-tabs :reviews="reviews"></p-tabs>
 
      </div>
  `,
  data() {
    return {
      product: "Silicone Cases",
      brand: "iPhone XS",
      selectedVariant: 0,
      details: ["80% cotton", "20% polyester", "gender-neutral"],
      reviews: [],
      variants: [
        {
          variantId: 2232,
          variantColor: "black",
          variantImage: "./assets/MRW72_AV1_GOLD_GEO_ES.jpg",
          variantQuantity: 10,
        },
        {
          variantId: 2233,
          variantColor: "pink",
          variantImage: "./assets/MW9A2_AV1_GOLD_GEO_ES.jpg",
          variantQuantity: 4,
        },
      ],
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    updateProduct(index) {
      this.selectedVariant = index; //this hace referencia a data de la instancia
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      if (this.premium) {
        //this para data y props
        return "Free";
      }
      return 2.99;
    },
  },
  mounted() {
    eventBus.$on("review-submitted", (productReview) => {
      this.reviews.push(productReview);
    });
  },
});

Vue.component("p-review", {
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
      <p>
        <input type="submit" value="Submit">  
      </p>
          <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>
    
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.errors = [];
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
      }
    },
  },
});

Vue.component("p-tabs", {
  props: {
    reviews: {
      type: Array,
      required: false,
    },
  },
  template: `
    <div>
    
      <div>
        <span class="tab" 
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              :key="index"
              @click="selectedTab = tab"
        >{{ tab }}</span>
      </div>
      
      <div v-show="selectedTab === 'Reviews'">
          <p v-if="!reviews.length">There are no reviews yet.</p>
          <ul>
              <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>Rating:{{ review.rating }}</p>
                <p>{{ review.review }}</p>
              </li>
          </ul>
      </div>
      
      <div v-show="selectedTab === 'Make a Review'">
        <p-review></p-review>        
      </div>
  
    </div>

  `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews",
    };
  },
});

var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
  },
});
