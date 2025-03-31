import { Need, NOTHING } from '@itrocks/action'
import { Edit }          from '@itrocks/edit'
import { Route }         from '@itrocks/route'

@Need(NOTHING)
@Route('/new')
export class New<T extends object = object> extends Edit<T>
{

}
