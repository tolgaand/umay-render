import { useParams } from "react-router-dom";
import DemoListView from "./DemoListView";
import DemoDetailView from "./DemoDetailView";

// Ana demo bileşeni - rotaya göre doğru bileşeni göster
export default function DemoView() {
  const { id } = useParams<{ id: string }>();

  // ID parametresi varsa detay, yoksa liste göster
  return id ? <DemoDetailView /> : <DemoListView />;
}
