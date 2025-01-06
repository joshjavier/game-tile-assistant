import { useNavigate, useParams } from "react-router"
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "./ui/select"
import { createListCollection } from "@chakra-ui/react"
import { BrandAbbreviation, type BrandSlug } from "@/app/types"

const BrandStateSelect = () => {
  const { brand, state } = useParams()
  const navigate = useNavigate()

  return (
    <SelectRoot
      collection={states}
      width="6.8em"
      variant="subtle"
      value={[`${brand}-${state}`]}
      onValueChange={e => {
        const { brand, state } = e.items[0]
        navigate(`/${brand}/${state}`)
      }}
      flexShrink={0}
    >
      <SelectTrigger>
        <SelectValueText placeholder="State" />
      </SelectTrigger>
      <SelectContent>
        {states.items.map(item => (
          <SelectItem item={item} key={item.id}>
            {states.stringifyItem(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}

const states = createListCollection({
  items: [
    { id: 1, brand: "betmgm", state: "nj" },
    { id: 2, brand: "betmgm", state: "pa" },
    { id: 3, brand: "betmgm", state: "mi" },
    { id: 4, brand: "betmgm", state: "wv" },
    { id: 5, brand: "betmgm", state: "on" },
    { id: 6, brand: "borgata", state: "nj" },
    { id: 7, brand: "borgata", state: "pa" },
    { id: 8, brand: "partycasino", state: "nj" },
    { id: 9, brand: "wof", state: "nj" },
    { id: 10, brand: "wof", state: "on" },
  ],
  itemToValue: item => item.brand + "-" + item.state,
  itemToString: item =>
    (
      BrandAbbreviation[item.brand as BrandSlug] +
      " " +
      item.state
    ).toUpperCase(),
})

export default BrandStateSelect
