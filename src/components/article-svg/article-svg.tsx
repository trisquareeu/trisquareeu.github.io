import ActivationScoresSvg from '../../../public/activation_scores.svg';
import GrammarsSvg from '../../../public/grammars.svg';
import './article-svg.css';

export const ArticleSvg = (props: { name: 'grammars' | 'activation_scores' }) => {
  switch (props.name) {
    case 'activation_scores':
      return <ActivationScoresSvg {...props} aria-labelledby="svgTitle" />;
    case 'grammars':
      return <GrammarsSvg {...props} aria-labelledby="svgTitle" />;
  }
};
