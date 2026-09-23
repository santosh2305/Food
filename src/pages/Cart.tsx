import { CartContents } from '../components/CartContents';
export default function CartPage() {
  return (
    <div className="container page-space">
      <div className="page-heading">
        <p className="eyebrow">A MEAL TO LOOK FORWARD TO</p>
        <h1>
          Your <em>cart.</em>
        </h1>
      </div>
      <CartContents />
    </div>
  );
}
