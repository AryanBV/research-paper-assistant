// server/services/aiService.js
/**
 * This service handles AI-based content generation for research papers
 * It generates section content based on title, abstract, and keywords
 * Also provides AI-generated captions for images
 */

// Simple template-based content generation (replace with actual AI API in production)
const generateSectionContent = (sectionType, paperDetails) => {
    const { title, abstract, keywords } = paperDetails;
    const keywordsList = keywords.split(',').map(k => k.trim());
    
    // Templates for different section types
    const templates = {
      introduction: `This paper examines ${title.toLowerCase()}. ${abstract.split('.')[0]}. 
      Recent advancements in ${keywordsList[0]} have led to significant developments in this field. 
      The objective of this research is to analyze the relationship between ${keywordsList.join(' and ')} 
      and provide insights that can contribute to the broader understanding of this topic.`,
      
      methodology: `This section outlines the approach used to investigate ${title.toLowerCase()}. 
      The methodology employed in this study involves a systematic analysis of ${keywordsList.join(', ')}. 
      Data was collected through comprehensive literature review and experimental validation. 
      The analysis was conducted using statistical methods appropriate for this type of research.`,
      
      results: `The results of our investigation into ${title.toLowerCase()} reveal several key findings. 
      Analysis of the data demonstrates a clear correlation between ${keywordsList[0]} and research outcomes. 
      Figure 1 illustrates the relationship between the key variables examined in this study. 
      These findings support the hypothesis that ${abstract.split('.')[0].toLowerCase()}.`,
      
      discussion: `Our findings regarding ${title.toLowerCase()} have several important implications. 
      The observed relationship between ${keywordsList.join(' and ')} suggests that further research 
      in this area could yield valuable insights. These results align with previous studies that have 
      indicated the importance of ${keywordsList[0]} in this field. However, certain limitations should 
      be acknowledged when interpreting these findings.`,
      
      conclusion: `This paper has examined ${title.toLowerCase()} and provided evidence supporting 
      the relationship between ${keywordsList.join(' and ')}. The findings contribute to the existing 
      body of knowledge on this topic and offer practical implications for professionals in this field. 
      Future research should focus on expanding the scope of analysis and addressing the limitations 
      identified in this study.`
    };
    
    return templates[sectionType] || 
      `This section explores aspects of ${title} related to ${keywordsList.join(', ')}.`;
  };
  
  // Generate image captions based on image name and paper context
  const generateImageCaption = (imageName, paperDetails) => {
    const { title, keywords } = paperDetails;
    // Extract just 3-5 keywords from the keywords string
    let keywordList = [];
    if (keywords && keywords.includes(',')) {
      keywordList = keywords.split(',').map(k => k.trim()).slice(0, 3);
    } else {
      // If keywords field contains the abstract, extract meaningful words
      const importantWords = keywords.match(/\b(deep learning|neural networks|medical image|analysis|diagnostic|performance|classification)\b/g);
      keywordList = importantWords ? importantWords.slice(0, 3) : ['deep learning', 'medical imaging'];
    }
    
    const fileExtension = imageName.split('.').pop().toLowerCase();
    const fileName = imageName.split('.')[0].replace(/_/g, ' ');
    
    const isGraph = ['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension) && 
      (imageName.toLowerCase().includes('graph') || 
       imageName.toLowerCase().includes('chart') || 
       imageName.toLowerCase().includes('plot') || 
       imageName.toLowerCase().includes('figure'));
    
    if (isGraph) {
      return `Fig. ${Math.floor(Math.random() * 5) + 1}: This graph illustrates the relationship between ${
        keywordList[0] || 'deep learning'} and ${keywordList[1] || 'medical imaging'} in ${title}.`;
    } else {
      return `Fig. ${Math.floor(Math.random() * 5) + 1}: Illustration of ${fileName} demonstrating key aspects of ${
        keywordList[0] || 'deep learning techniques in medical imaging'}.`;
    }
  };
  
  module.exports = {
    generateSectionContent,
    generateImageCaption
  };