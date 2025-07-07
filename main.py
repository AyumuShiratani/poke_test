import json
import random

def get_effectiveness(attacker, defender, type_chart):
    """タイプ相性を計算する関数だよ！"""
    if defender in type_chart[attacker]["immune_to"]:
        return 0.0
    elif defender in type_chart[attacker]["weak_to"]:
        return 2.0
    elif defender in type_chart[attacker]["resistant_to"]:
        return 0.5
    else:
        return 1.0

def en_to_ja(type_en, types_dict):
    """英語タイプ名から日本語タイプ名を返すよ！"""
    return types_dict.get(type_en, type_en)

def calc_and_print(type1, type2, types_dict, type_chart):
    """相性計算して結果を出力する関数！"""
    effectiveness = get_effectiveness(type1, type2, type_chart)
    print(f"{en_to_ja(type1, types_dict)} に {en_to_ja(type2, types_dict)} を打つときの相性は {effectiveness}")

def main():
    with open("data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    types = list(data["types"].keys())
    type_chart = data["type_chart"]
    types_dict = data["types"]

    # たまに複合タイプも出すよ！
    if random.random() < 0.5:
        type1_1, type1_2 = random.sample(types, 2)
        type2 = random.choice(types)
        effectiveness = (
            get_effectiveness(type1_1, type2, type_chart) *
            get_effectiveness(type1_2, type2, type_chart)
        )
        print(f"{en_to_ja(type1_1, types_dict)}・{en_to_ja(type1_2, types_dict)} に {en_to_ja(type2, types_dict)} を打つときの相性は {effectiveness}")
    else:
        type1, type2 = random.sample(types, 2)
        calc_and_print(type1, type2, types_dict, type_chart)

if __name__ == "__main__":
    main()