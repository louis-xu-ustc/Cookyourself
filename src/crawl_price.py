import time
import traceback

from cookyourself.amazon import *
from cookyourself.myutil import *
from cookyourself.parser import PriceParser

from cookyourself.models import Ingredient


# unit to grams
unit = dict()
unit['oz'] = 28.3495
unit['lb'] = 453.592

amazon = AmazonProductAPI()
parser = PriceParser()

ingreds = Ingredient.objects.all()
for ingred in ingreds:
    time.sleep(1)

    query = ingred.name
    soup = BeautifulSoup(amazon.search(query), 'html.parser')

    products = [item.text for item in soup.select('itemattributes title')]
    urls = [item.text for item in soup.select('item detailpageurl')]
    try:
        prices = [to_float(item.text.replace('$','')) for item in soup.select('offersummary formattedprice')]
    except Exception as e:
        print(e)
        continue

    target = None
    min_ppu = 100
    results = list(zip(products, prices))
    for i, result in enumerate(results):
        name = result[0]
        price = result[1]

        # info[0]: name, info[1]: weight, info[2]:packs, info[3]: unit
        info = parser.parse(name)
        factor = 1
        if info[3] == 'oz':
            factor = factor*unit['oz']
        if info[3] == 'lb':
            factor = factor*unit['lb']

        if info[1]:
            factor = factor*info[1]
        if info[2]:
            factor = factor*info[2]

        ppu = price/factor
        if ppu < min_ppu:
            min_ppu = ppu
            target = result

    if target:
        try:
            print(query + ": " + str(min_ppu))
        except Exception as e:
            print(e)
            traceback.print_exc()
        ingred.price = min_ppu
        ingred.save()
    else:
        print(query + ": price info is not found.")
