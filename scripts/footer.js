(function () {
  var mount = document.getElementById("site-footer-mount");
  if (!mount) return;

  mount.outerHTML = `
<footer class="footer">
  <div class="footer__container">
    <div class="footer__top">
      <div class="footer__top-item">
        <p class="footer__top-title">BuildMart</p>
        <p class="footer__top-text">
          Your trusted source for premium building materials and construction supplies since 1995.
        </p>
        <div class="footer__social" aria-label="Social media">
          <a class="footer__social-link" href="#" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#sym-social-facebook"></use></svg>
          </a>
          <a class="footer__social-link" href="#" aria-label="Twitter">
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#sym-social-twitter"></use></svg>
          </a>
          <a class="footer__social-link" href="#" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#sym-social-instagram"></use></svg>
          </a>
          <a class="footer__social-link" href="#" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#sym-social-linkedin"></use></svg>
          </a>
        </div>
      </div>
      <div class="footer__top-item">
        <p class="footer__top-title">Quick Links</p>
        <ul class="footer__links">
          <li><a class="footer__link" href="#">About Us</a></li>
          <li><a class="footer__link" href="#">Products</a></li>
          <li><a class="footer__link" href="#">Delivery Info</a></li>
          <li><a class="footer__link" href="#">Returns Policy</a></li>
        </ul>
      </div>
      <div class="footer__top-item">
        <p class="footer__top-title">Customer Service</p>
        <ul class="footer__links">
          <li><a class="footer__link" href="#">Contact Us</a></li>
          <li><a class="footer__link" href="#">FAQs</a></li>
          <li><a class="footer__link" href="#">Shipping &amp; Tracking</a></li>
          <li><a class="footer__link" href="#">Privacy Policy</a></li>
        </ul>
      </div>
      <div class="footer__top-item">
        <p class="footer__top-title">Newsletter</p>
        <p class="footer__top-text">Subscribe for updates and exclusive deals.</p>
        <form class="footer__newsletter" action="#" method="post">
          <label class="footer__visually-hidden" for="footer-email">Your email</label>
          <input
            id="footer-email"
            class="footer__input"
            type="email"
            name="email"
            placeholder="Your email"
            autocomplete="email"
          />
          <button class="footer__button" type="submit" aria-label="Subscribe">
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#sym-mail"></use></svg>
          </button>
        </form>
      </div>
    </div>

    <div class="footer__contacts">
      <div class="footer__contacts-grid">
        <div class="footer__contacts-item">
          <p class="footer__contacts-title">Phone</p>
          <p class="footer__contacts-text">1-800-BUILD-MART</p>
        </div>
        <div class="footer__contacts-item">
          <p class="footer__contacts-title">Email</p>
          <p class="footer__contacts-text">support@buildmart.com</p>
        </div>
        <div class="footer__contacts-item">
          <p class="footer__contacts-title">Address</p>
          <p class="footer__contacts-text">123 Construction Ave, Builder City, BC 12345</p>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <p class="footer__copyright">© 2026 BuildMart. All rights reserved.</p>
    </div>
  </div>
</footer>
`.trim();
})();
