function generate_donation_form() {
    document.getElementById('donation').innerHTML = `
        <iframe src="https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=I%20love%20donations%20for%20my%20development&targets-hint=&default-sum=&button-text=14&hint=&successURL=&quickpay=shop&account=410011913349024" width="423" height="222" frameborder="0" allowtransparency="true" scrolling="no"></iframe>
    `
}