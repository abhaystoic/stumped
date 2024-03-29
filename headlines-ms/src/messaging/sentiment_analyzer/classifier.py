"""Module for classifying the news after Sentiment Analysis.

Please download the vader_lexicon first time by using the following command:
nltk.download('vader_lexicon')

"""


import json
import nltk
# import numpy as np
# import math
# import matplotlib.pyplot as plt
# import pandas as pd
# import seaborn as sns

from IPython import display
from nltk.sentiment.vader import SentimentIntensityAnalyzer as SIA
from pprint import pprint


def classify(all_news):
  nltk.download('vader_lexicon')
  
  sia = SIA()
  results = []

  for article in all_news['articles']:
    print(article)
    desc = article.get('description', '') or ''
    content = article.get('content', '') or ''
    pol_score = sia.polarity_scores(desc + ' ' + content)
    results.append(pol_score)
    article.update({
      'negativity': pol_score['neg'],
      'positivity': pol_score['pos'],
      'neutrality': pol_score['neu'],
    })
  return all_news
