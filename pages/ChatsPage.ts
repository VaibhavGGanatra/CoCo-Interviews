import { expect } from '@playwright/test'
import BasePage from './BasePage'
import { LC_SKILL_ID } from './SkillsPage'
require('dotenv').config()
let region = process.env.REGION_SELECTED || 'us'

export const SKILL_TIMEOUT = {
    MEDIUM_TIMEOUT: 300000,
    LARGE_TIMEOUT: 600000,
    EXTREME_TIMEOUT: 1200000
}

type AskQuestionsAIPropType = {
    prompt: string
    withWelcome?: boolean
    expectedBotMessageCount?: number
}

export default class ChatsPage extends BasePage {
    // Chat input area
    chatContainer = this.page.getByLabel('Chat window')
    chatTextBox = this.chatContainer.locator('.chat-input #cocounsel-prompt').locator('textarea')
    messageBox = this.page.locator('saf-message-box')
    chatResponseByText = (text: string) => this.page.locator(`div.delphi-skill-summary:has-text("${text}")`)
    chatResponseByUser = this.page.locator('saf-message-box[appearance="user"]')
    chatResponseByUserText = this.chatResponseByUser.last().locator('div.MuiTypography-bodyMdRegularStandard').first()
    chatResponseByUserFileAddedText = this.page.locator('saf-message-box[appearance="user"] div.MuiTypography-bodyMdStrongStandard')
    chatResponseByBot = this.page.locator('saf-message-box[appearance="agent"]')
    cancelledSkillMessage = this.page.locator('saf-message-box[appearance="agent"] [data-testid="chat-markdown-container"] div')
    chatResponseByBotWithButton = this.page.locator('saf-message-box[appearance="agent"] saf-button')
    chatResponseByUserWithButton = this.page.locator('saf-message-box[appearance="user"] button')
    itemsInChatResponse = '.grid-container button div.MuiTypography-bodySmRegularStandard'
    totalFilesAddedMessage = this.chatResponseByUser.last().locator('div.MuiTypography-bodyMdStrongStandard').first()
    filesAddedMessage = this.chatResponseByUser.last().locator(`${this.itemsInChatResponse}`)
    filesAddedMessageContainer = this.chatResponseByUser.last().locator('.grid-container')
    filesAddedMessageFileBlock = (fileName: string) => this.filesAddedMessageContainer.locator(`div.MuiTypography-bodySmRegularStandard:has-text("${fileName}")`)
    filesAddedShowButton = this.chatResponseByUser.last().locator('.grid-container + saf-button')
    sendButton = this.page.locator('#send')
    delphiAIWelcomeMessage = this.page.locator('.delphi-ai-welcome-message')
    chatSendSpinner = this.page.locator('#send saf-progress-ring')
    coCounselSkillsButton = this.page.getByTestId('skill-list-open-btn')
    learnMoreLink = this.page.locator('saf-anchor:has-text("Learn more") a')
    submitRequestButton = this.page.locator('.form-submit-buttons saf-button[type="submit"].no-wrap-button').getByText('Submit request')
    cancelButton = this.page.locator('.form-submit-button saf-button').getByText('Cancel')
    submitAARRequestButton = this.page.locator('[skill="ai_assisted_legal_research"] + div saf-button:has-text("Start AI-Assisted Research")')
    submitAskPLRequestButton = this.page.locator(`[skill="ask_practical_law_ai"] + div saf-button:has-text("Search & Summarize Practical Law ${region.toUpperCase()}")`)
    buttonByText = (text: string) => this.page.locator(`saf-button:has-text("${text}")`)
    activeVersion = this.page.getByTestId('active-version')
    chatProgressBar = this.page.getByRole('progressbar')
    selectDatabaseButton = this.page.locator('#search-database-button')
    recommendedSkillCardsText = this.page.locator('.delphi-ai-welcome-message__rec-actions__cards div.MuiCard-root')

    //Chat Upload Component
    fileUploadSelectionArea = this.page.getByTestId('file-upload-selection-area')
    uploadComponent = {
        title: this.page.locator('.file-upload__title'),
        subtitle: this.page.locator('.file-upload__subtitle'),
        info: this.page.locator('#message-upload-support-inf'),
        dragAndDropInput: this.fileUploadSelectionArea.locator('input')
    }
    chatUploadFileFromDeviceButton = this.page.getByTestId('file-upload-select-from-message-container')
    chatUploadFileFromExternalDMSButton = this.page.locator('saf-button:has-text("Files from external DMS")')
    chatUploadFileFromThisMatterButton = this.page.locator('saf-button:has-text("Files from this matter")')
    chatUploadFileFromThisChatButton = this.page.locator('saf-button:has-text("Files from this chat")')
    chatUploadFileFromADatabaseButton = this.page.locator('saf-button:has-text("Files from a database")')
    stagedFileChips = this.page.locator('div.chat-input .MuiChip-root')
    stagedFileChipsTypeIcon = this.page.locator('div.chat-input .MuiChip-icon')
    stagedChipsDeleteIcon = this.page.locator('div.chat-input .MuiChip-deleteIcon')
    viewAllStagedFilesButton = this.page.locator('.chat-input > div:not(.actions) > saf-button[appearance="tertiary"]')
    stagedChipWithName = (chipName: string) => this.page.locator(`div.chat-input span.MuiChip-label:has-text("${chipName}")`)
    relativeStagedChipCloseIcon = (chipName: string) => this.page.locator(`//span[contains(@class,"MuiChip-label")][text()='${chipName}']/following-sibling::saf-icon`)
    replaceFileDialog = this.page.locator('div.MuiDialog-paper')
    replaceFileDialogTitle = this.page.locator('div.MuiDialog-paper h2')
    replaceFileDialogContent = this.page.locator('div.MuiDialog-paper .MuiDialogContentText-root')
    replaceFileDialogKeepButton = this.page.locator('div.MuiDialog-paper .MuiButton-outlinedPrimary')
    replaceFileDialogClearButton = this.page.locator('div.MuiDialog-paper .MuiButton-containedPrimary')
    viewAllStagedFilesDialog = this.page.locator('div[aria-labelledby="dialog-title-view-all-files-dialog"]')
    //View all staged files dialog
    viewAllFilesDialog = {
        dialogTitle: this.page.locator('div[aria-labelledby="dialog-title-view-all-files-dialog"] .dialog-title'),
        removeAllButton: this.page.locator('[data-testid="view-all-delete-files-button"]'),
        selectAllCheckbox: this.page.locator('.action-items saf-checkbox'),
        filesSelectedText: this.page.locator('.action-items .checkbox-container span'),
        showingText: this.page.locator('.pagination-showing'),
        headerCells: this.page.locator('.wj-cell.wj-header:not([role="rowheader"])'),
        rowCheckbox: this.page.locator('input.wj-column-selector'),
        nameCell: this.page.locator('div.wj-cells div.wj-cell:nth-child(1)'),
        fileTypeCell: this.page.locator('div.wj-cells div.wj-cell:nth-child(2)'),
        sizeCell: this.page.locator('div.wj-cells div.wj-cell:nth-child(3)'),
        removeCell: this.page.locator('div.wj-cells div.wj-cell:nth-child(4)'),
        doneButton: this.page.locator('#view-all-files-dialog saf-button[data-testid="file-upload-close-button"]'),
        closeIcon: this.page.locator('#view-all-files-dialog saf-button[aria-label="Close"]')
    }

    // Skill card name
    skillCardName = this.page.locator('[data-testid="delphi-skill-label"]')
    // Skill card/form
    skillFormInput = this.page.locator('.form-container saf-text-area textarea')
    skillProgressArea = this.page.locator('[data-testid="flow-status-progress-bar"]')
    skillCardHeaderText = this.page.locator('.flow-status__container__header__text')
    skillProgressText = this.page.locator('[data-testid="flow-status-progress-bar"] div span.label')
    skillProgressValueText = this.page.locator('[data-testid="flow-status-progress-bar"] div span.value')
    skillProgressBar = this.page.locator('[data-testid="flow-status-progress-bar"] .progress')
    //DisabledSkills
    sdbDisabled = this.page.locator('[data-testid="action-sdb-disabled"]')
    reviewDisabled = this.page.locator('[data-testid="action-review-disabled"]')
    summarizeDisabled = this.page.locator('[data-testid="action-summarize-disabled"]')
    draftDisabled = this.page.locator('[data-testid="action-draft-disabled"]')

    // Long Context
    skillResponseTitle = this.page.locator('[data-testid="skill-response-title"]')
    skillProgressSpinner = this.page.locator('[data-testid="skill-progress-bar"]')
    respondingToSkillText = this.page.locator('[data-testid="skill-progress-bar"] .MuiBox-root')
    respondingProgressBar = this.page.locator('[data-testid="skill-progress-bar"] .MuiLinearProgress-root')
    skillDownloadButton = this.page.locator('#delphi-download-menu')
    viewAllCitedSourcesButton = this.page.locator('[data-testid="chat-markdown-container"] .MuiBox-root > saf-button')

    skillCardFilesText = (numberOfFiles: number) => this.page.locator('.skill-summary__content__card-header__eyebrow').getByText(`Files (${numberOfFiles})`)
    skillCardFiles = this.page.locator('.skill-summary__content div .grid-container .grid-item')
    skillCardFileIcons = this.page.locator('.skill-summary__content div .grid-container .grid-item saf-icon')
    skillCardFileNames = this.page.locator('.skill-summary__content div .grid-container .grid-item div.MuiTypography-bodySmRegularStandard')
    skillCardFilesShowMoreOrLessButton = this.page.locator('.skill-summary__content div saf-button')
    skillCardFilesShowMoreText = (numberOfFiles: string) => this.page.locator(`.skill-summary__content div saf-button:has-text("Show ${numberOfFiles} more")`)
    skillCardFilesShowMoreIcon = this.page.locator('.skill-summary__content div + saf-button saf-icon[icon-name="chevron-down"]')
    skillCardFilesShowMLessIcon = this.page.locator('.skill-summary__content div + saf-button saf-icon[icon-name="chevron-up"]')
    skillCardRequestText = this.page.locator('.skill-summary__content__card-header__eyebrow').getByText('Request')
    skillCardDescriptionText = this.page.locator('.skill-summary__content__card-header__eyebrow').getByText('Description')
    skillCardSummaryTypeText = this.page.locator('.skill-summary__content__card-header__eyebrow').getByText('Summary Type')
    skillCardRequestOrDescriptionOrSummary = this.page.locator('[data-testid="skill-summary-skill-info-simple"]')
    skillCardQuestionsText = (numberOfQuestions: number) => this.page.locator('.skill-summary__content__card-header__eyebrow').getByText(`Questions (${numberOfQuestions})`)
    skillCardQuestions = this.page.locator('.skill-summary__content ol li.collapsible-grid-item')
    skillCardQuestionsShowMoreOrLessButton = this.page.locator('.skill-summary__content saf-button')
    skillCardQuestionsOrPoliciesShowMoreOrLessText = (numberOfQuestions: string) => this.page.locator(`.skill-summary__content saf-button:has-text("Show ${numberOfQuestions} more")`)
    skillCardQuestionsOrPoliciesShowMoreIcon = this.page.locator('.skill-summary__content ol + saf-button saf-icon[icon-name="chevron-down"]')
    skillCardQuestionsOrPoliciesShowMoreButton = this.page.locator('.skill-summary__content ol + saf-button')
    skillCardQuestionsShowLessIcon = this.page.locator('.skill-summary__content ol + saf-button saf-icon[icon-name="chevron-up"]')
    skillCardQuestionsShowLessButton = this.page.locator('.skill-summary__content ol + saf-button')
    skillCardPoliciesText = (numberOfPolicies: number) => this.page.locator('.skill-summary__content__card-header__eyebrow').getByText(`Policies (${numberOfPolicies})`)

    skillStatusSuccessIcon = this.page.locator('[icon-name="check-circle"]')
    skillStatusSuccessText = this.page.locator('[data-testid="flow-status-text"]')
    cancelSkillsButton = this.page.locator('[data-testid="skill-summary-cancel-btn"]')
    viewSkillsButton = this.page.locator('.skill-summary__controls__result-btns saf-button[type="button"][data-testid="skill-summary-results-btn"]')
    summarizeFormLabel = this.page.getByLabel('Select your summary length')
    summarizeFormRadioButtons = this.page.locator('[name="summarize-form"] saf-radio')
    summarizeFormRadioButtonText = (formButtonName: string) => this.page.locator(`[name="summarize-form"] saf-radio:has-text("${formButtonName}")`)
    depositionFormHeader = this.page.locator('.collapse-container h3')
    inputCharacterCount = this.page.locator('div.remaining-text-counter-wrapper slot')
    // Summarize skill results page
    nonTabularSkillResultsContainer = this.page.locator('.delphi-skill-result-summary-container')
    tabularSkillResultsContainer = this.page.locator('.delphi-skill-response')
    // Upload button in chats
    uploadButton = this.page.locator('.chat-input-upload-button:not(.disabled)')
    filesFromYourDeviceButton = this.page.locator('saf-menu-item:has-text("Files from your device")')
    filesFromThisMatterButton = this.page.locator('saf-menu-item:has-text("Files from this matter")')
    filesFromADatabaseButton = this.page.locator('saf-menu-item:has-text("Files from a database")')
    filesFromThisChatButton = this.page.locator('saf-menu-item:has-text("Files from this chat")')
    searchAnEntireDatabaseButton = this.page.locator('saf-menu-item:has-text("Search an entire database")')
    filesFromExternalDMS = this.page.locator('saf-menu-item:has-text("Files from external DMS")')
    // AI research skills
    researchToolTipIcon = this.page.locator('.radio-subheader saf-button')
    researchToolTipText = this.page.locator('.radio-subheader saf-tooltip')
    aarRadioButton = this.page.locator('#ai_assisted_legal_research')
    askPLRadioButton = this.page.locator('#ask_practical_law_ai')
    aarRadioButtonToolTipIcon = this.page.locator('#ai_assisted_legal_research button')
    aarAboutSkillButton = this.page.locator('#ai_assisted_legal_research saf-anchor')
    askPLAboutSkillButton = this.page.locator('#ask_practical_law_ai saf-anchor')
    aarDialogTitle = this.page.locator('[dialog-title="AI-Assisted Research"]').locator('.dialog-title')
    askPLDialogTitle = this.page.locator(`[dialog-title="Search & Summarize Practical Law ${region.toUpperCase()}"]`).locator('.dialog-title')
    aarDialogCloseButton = this.page.locator('[dialog-title="AI-Assisted Research"] saf-button:has-text("Close")')
    askPLRadioButtonToolTipIcon = this.page.locator('#ask_practical_law_ai button')
    aarRadioButtonToolTipText = this.page.locator('#ai_assisted_legal_research saf-tooltip')
    askPLRadioButtonToolTipText = this.page.locator('#ask_practical_law_ai saf-tooltip')
    // Review
    reviewQuestionInput = this.page.locator('saf-text-area[placeholder="Type a question here"] textarea')
    cancelButtonInChat = this.page.locator('div.open .form-submit-buttons saf-button').getByText('Cancel')

    userIdByText = (text: string) => this.page.locator(`saf-metadata-item:has-text("${text}")`)
    userChatTime = (user: string) => this.page.locator(`saf-metadata-item:has-text("${user}") + saf-metadata-item`)
    chatInputField = this.page.locator('//saf-text-area[@id="cocounsel-prompt"]')
    chatResponse = this.page.locator('.message-box-metadata + div p')
    searchDatabaseRec = this.page.locator('saf-button[data-testid="skill-list-skill-btn_lc_sdb"]:has-text("Search a Database")')
    reviewDocumentsRec = this.page.locator('saf-button[data-testid="skill-list-skill-btn_lc_review_documents"]')
    compareDocumentsRec = this.page.locator('saf-button[data-testid="skill-list-skill-btn_lc_compare_docs"]')
    aiAssistantRec = this.page.locator('saf-button[data-testid="skill-list-skill-btn_ai_assisted_legal_research"]')
    practicalLawRec = this.page.locator('saf-button[data-testid="skill-list-skill-btn_ask_practical_law_ai"]')
    summarizeRec = this.page.locator('saf-button[data-testid="skill-list-skill-btn_lc_summarize"]')
    timelineRec = this.page.locator('saf-button[data-testid="skill-list-skill-btn_lc_timeline"]')
    timelineLegacyRec = this.page.locator('saf-button[data-testid="skill-list-skill-btn_timeline"]')
    draftRec = this.page.locator('saf-button[data-testid="skill-list-skill-btn_lc_correspondence"]')
    prepareForDepositionRec = this.page.locator('saf-button[data-testid="skill-list-skill-btn_lc_depo_prep"]')

    //CoCounsel Skills in new chat section
    reviewCard = this.page.getByTestId('action-review')
    summarizeCard = this.page.getByTestId('action-summarize')
    researchCard = this.page.getByTestId('action-research')
    draftCard = this.page.getByTestId('action-draft')
    sdbCard = this.page.getByTestId('action-sdb')
    showAllSkillsLink = this.page.getByTestId('action-what-else')
    showAllSkillButtons = this.page.locator('saf-chat .delphi-skill-list__skill__btn')
    showAllSkillsListButton = this.page.locator('saf-chat .delphi-skill-list .delphi-skill-list__skill saf-button')
    showAllSkillsList = this.page.locator('saf-chat .delphi-skill-list')
    chatResponseHeader = (text: string) => this.page.locator(`h3:has-text("${text}")`)

    //Select summary length
    summaryTypeLabel = this.page.locator('#delphi-summary_type-radio-group-label')
    briefRadioButton = this.page.locator('#BRIEF')
    detailedRadioButton = this.page.locator('#DETAILED')
    comprehensiveRadioButton = this.page.locator('#COMPREHENSIVE')

    // Add from favorites
    questionOrPolicyLabel = this.page.locator('div.label-container .label')
    addQuestionOrPolicyInput = this.page.locator('.string-array-input__fields saf-text-area textarea')
    addQuestionButton = this.page.locator('[data-testid="add-string-field-button"] button')
    addQuestionButtonIcon = this.page.locator('[data-testid="add-string-field-button"] saf-icon[icon-name="plus"]')
    addFromFavoritesButton = this.page.locator('.string-array-input__add-buttons saf-button').getByText('Add from favorites')
    addFromFavoritesButtonIcon = this.page.locator('.string-array-input__add-buttons saf-icon[icon-name="heart"]')
    deleteQuestionOrPolicyButton = (index: string) => this.page.locator(`[data-testid="delete-string-field-button-${index}"]`)

    addFromFavoritesModalHeader = this.page.locator('.dialog-title').getByText('Add from favorites')
    addFromFavoritesModalSubHeader = this.page.locator('.dialog-subtitle').getByText('Select the favorites you want to use.')
    favoriteCheckBoxByName = (favoriteName: string) => this.page.locator(`//div[contains(text(), "${favoriteName}")]/preceding-sibling::div[contains(@class,"wj-cell")]//input`)
    addButtonOnAddFromFavoritesModal = this.page.locator('.delphi-add-from-favorites-modal__actions saf-button').getByText('Add')

    longContext = {
        skillTitle: this.page.getByTestId('skill-response-title'),
        skillAdditionalTitle: this.page.locator('.delphi-results-header__additional-title'),
        skillAdditionalTitleInfoIcon: this.page.locator('.delphi-results-header__additional-title saf-icon'),
        skillResponseTime: this.page.getByTestId('skill-response-time'),
        skillProgressBar: this.page.getByTestId('skill-progress-bar'),
        skillCancelButton: this.page.locator('[data-testid="cancel-skill-request"]'),
        viewCitedSourcesButton: (skillId: string, flowId: string) => this.page.getByTestId(`view-footnotes-${skillId}-${flowId}`),
        skillResponseText: this.page.locator('.MuiBox-root p'),
        skillResponseTableDataText: this.page.locator('.MuiBox-root td'),
        allFootNotePanelTitle: this.page.getByTestId('footnotes-panel-title'),
        allFootnotesButton: this.page.getByTestId('footnotes-header').locator('button'),
        allFootNotesLinks: (flowId: string) => this.page.locator(`//a[contains(@id, "flowId-${flowId}-citation")]`),
        footNoteTitleNumber: (footNoteNumber: number) => this.page.getByTestId(`footnote-number-${footNoteNumber}`),
        footNoteTitleFileName: (footNoteNumber: number) => this.page.getByTestId(`footnote-file-name-${footNoteNumber}`),
        askFollowUpQuestionButton: this.page.getByTestId('skill-response-summary-follow-up'),
        askFollowUpQuestionButtonByFlowId: (flowId: string) => this.page.locator(`#skill-response-summary-follow-up-${flowId}`),
        disabledAskFollowUpQuestionButton: this.page.locator('[data-testid="skill-response-summary-follow-up"].disabled'),
        askFollowUpToolTip: this.page.locator('[role="tooltip"].MuiTooltip-popper'),
        skillResponseFeedback: this.page.getByTestId('delphi-feedback'),
        downloadMenuButton: this.page.locator('#delphi-download-menu'),
        aiResultPanel: this.page.locator('.ai-result-panel'),
        aiResultPanelContent: this.page.locator('.ai-result-panel .left-content'),
        fileQuoteNumbers: this.page.locator('[id^="file-quote-"]'),
        allFootnotesContainer: this.page.locator('.delphi-skill--markdown'),
        footnoteNoteLinksInPanelBasedOnNumber: (index: number) => this.page.locator(`div[data-testid="virtuoso-scroller"] [data-item-index="${index - 1}"] button`),
        footNoteNumbersInPanel: this.page.locator('//saf-text[contains(@id,"file-quote")]'),
        footnoteNoteLinksInPanel: this.page.locator('div[data-testid="virtuoso-scroller"] button'),
        footnoteLinksResponse: this.page.locator('[data-testid="chat-markdown-container"] a'),
        footnoteLinksInParagraph: this.page.locator('[data-testid="chat-markdown-container"] p > a'),
        footnoteLinkByNumber: (index: number) => this.page.locator('[data-testid="chat-markdown-container"] a').nth(index - 1),
        footnotesFileViewer: this.page.locator('.delphi-file-viewer-panel__viewer'),
        bulletResponseOrdered: this.page.locator('[data-testid="chat-markdown-container"] li'),
        bulletQuestionResponse: this.page.locator('[data-testid="chat-markdown-container"] ol > li ul li'),
        paragraphResponse: this.page.locator('[data-testid="chat-markdown-container"] p'),
        tableResponse: this.page.locator('[data-testid="chat-markdown-container"] table'),
        tableResponseHeaders: this.page.locator('[data-testid="chat-markdown-container"] table th'),
        summarizeResponseFileNames: this.page.locator('[data-testid="chat-markdown-container"] h2'),
        singleFootnotePanelCloseButton: this.page.locator('[data-testid="footnotes-header"] + button'),
        allFootnotesPanelCloseButton: this.page.locator('[data-testid="footnotes-panel-title"] + button'),
        submitAARRequestButton: this.page.locator('.delphi-form saf-button:has-text("Start AI-Assisted Research")'),
        AARResponseLinks: this.page.locator('.delphi-answer-section saf-anchor[href]'),
        AARPanelTitle: this.page.locator('.delphi-split-view-panel-header h5.MuiTypography-headingLgStandard'),
        AARAccordionItems: this.page.locator('[id^="delphi-aalr-accordion-item-"]'),
        accordionInAIResponse: this.page.locator('div.delphi-skill-response saf-accordion-item'),
        submitAskPLRequestButton: this.page.locator(`.delphi-form saf-button:has-text("Search & Summarize Practical Law ${region.toUpperCase()}")`),
        openPLPanelLinks: this.page.locator('saf-anchor:has-text("Open in Practical Law")'),
        skillResponseFeedbackText: this.page.locator('[data-testid="delphi-feedback"] div.MuiTypography-bodyMdRegularStandard'),
        skillResponseFeedbackThumbsUp: this.page.locator('[data-testid="delphi-feedback"] [data-testid="thumbs-up-button"] saf-icon'),
        skillResponseFeedbackThumbsUpButton: this.page.locator('[data-testid="delphi-feedback"] [data-testid="thumbs-up-button"]'),
        skillResponseFeedbackThumbsDown: this.page.locator('[data-testid="delphi-feedback"] [data-testid="thumbs-down-button"] saf-icon'),
        skillResponseFeedbackThumbsDownButton: this.page.locator('[data-testid="delphi-feedback"] [data-testid="thumbs-down-button"]'),
        aarSkillResponseQuestion: this.page.locator('.delphi-skill--ai-assisted-legal-research__answer-section [appearance="body-strong-md"]'),
        skillResponseContainer: this.page.locator('div.delphi-skill-response__response'),
        dualPanelSplitter: this.page.locator('[aria-label="DUAL_PANEL.SPLITTER_ARIA_LABEL"] div'),
        askFollowUpStagedTag: this.page.locator('div.chat-input .MuiChip-root'),
        askFollowUpStagedTagCloseIcon: this.page.locator('div.chat-input .MuiChip-root .MuiChip-deleteIcon'),
        askFollowUpDialog: this.page.locator('saf-dialog.delphi-follow-up--dialog'),
        askFollowUpDialogTitle: this.page.locator('.delphi-follow-up--dialog .dialog-title'),
        askFollowUpDialogSubTitle: this.page.locator('.delphi-follow-up--dialog .dialog-subtitle'),
        askFollowUpDialogAnswerSection: this.page.locator('.delphi-follow-up--dialog .delphi-answer-section'),
        askFollowUpDialogAnswerSectionQuestion: this.page.locator('.delphi-follow-up--dialog .delphi-answer-section [appearance="body-strong-md"]'),
        askFollowUpDialogFollowUpActionButton: this.page.locator('.delphi-follow-up--dialog div.delphi-follow-up__action-button > div'),
        askFollowUpDialogCancelButton: this.page.locator('.delphi-follow-up--dialog saf-anchor.delphi-follow-up__action-button__btn'),
        askFollowUpDialogTextArea: this.page.locator('.delphi-follow-up--dialog textarea'),
        askFollowUpDialogTextSubmitIcon: this.page.locator('.delphi-follow-up--dialog saf-icon[icon-name="paper-plane"]'),
        askFollowUpDialogActiveCCVersion: this.page.locator('.delphi-follow-up--dialog [data-testid="active-version"]'),
        askFollowUpDialogCloseIcon: this.page.locator('.delphi-follow-up--dialog .dialog-header-wrapper [icon-name="xmark-large"]'),
    }

    documentViewer = {
        pdfViewer: this.page.locator('div#viewerContainer'),
        pdfViewerPages: this.page.locator('.pdfViewer div.page'),
        highlightedText: this.page.locator('div#viewerContainer .highlight-shard'),
        pageNumberInput: this.page.locator('input#pageNumber'),
        closePdfViewerButton: this.page.locator('.MuiButtonBase-root saf-icon[icon-name="close"]')
    }

    /**
     * Asks questions to AI by interacting with a chat interface.
     *
     * @param {Object} props - The properties for asking questions to AI.
     * @param {string} props.prompt - The prompt/question to be asked.
     * @param {boolean} [props.withWelcome=true] - Whether to expect a welcome message from AI.
     * @param {number} [props.expectedBotMessageCount=1] - The expected number of messages from the AI bot.
     *
     * @returns {Promise<void>}
     */
    async askQuestionsToAI({ prompt, withWelcome, expectedBotMessageCount }: AskQuestionsAIPropType): Promise<void> {
        await expect(this.chatTextBox).toBeEditable()
        await expect(this.chatTextBox).toBeVisible()
        await this.chatTextBox.pressSequentially(prompt, { delay: 100 })
        await expect(this.base.locatorByTextInChat(prompt)).not.toBeVisible()
        await expect(this.sendButton).toBeVisible()
        await expect(this.sendButton).toBeEnabled()
        if (withWelcome) {
            await expect(this.delphiAIWelcomeMessage).toHaveCount(withWelcome ? 1 : 0)
        }
        await this.sendButton.click()
        await this.page.waitForTimeout(500)
        await this.waitForElementNotToBeVisible(this.chatSendSpinner, 120000)
        await expect(this.sendButton).toBeEnabled()
        // await expect(this.base.locatorByText(prompt)).toBeVisible() TODO: This line fails when AI responds with a modified response
        if (expectedBotMessageCount) {
            await expect(this.chatResponseByBot).toHaveCount(expectedBotMessageCount)
        }
    }

    /**
     * Waits For Chat Spinner to Load
     * @async
     * @returns {Promise<void>}
     */
    async waitForChatSendSpinnerLoad(): Promise<void> {
        await expect(this.chatSendSpinner).toBeVisible()
        await expect(this.chatSendSpinner).not.toBeVisible()
        await expect(this.sendButton).toBeEnabled()
    }

    /**
     * Verifies that the last skill card's name matches the provided skill name.
     * @param {string} skillName - The expected name of the skill to verify.
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifySkillCardName(skillName: string): Promise<void> {
        await expect(this.submitRequestButton.last().or(this.submitAARRequestButton).last().or(this.submitAskPLRequestButton).last().or(this.viewSkillsButton).last()).toBeVisible()
        await this.skillCardName.last().scrollIntoViewIfNeeded()
        await expect(this.skillCardName.last()).toBeVisible()
        await expect(this.skillCardName.last()).toHaveText(skillName)
    }

    /**
     * Verifies the number of buttons and the selected button text in the Summarize form.
     * @param {number} numberOfButton - The expected name of the skill to verify.
     * @param {string} buttonText - The expected name of the skill selected to verify.
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifySelectedSummarizeButton(numberOfButtons: number, buttonText: string): Promise<void> {
        await expect(this.summarizeFormRadioButtons.first()).toBeVisible()
        expect(await this.summarizeFormRadioButtons.count()).toBe(numberOfButtons)
        await expect(this.summarizeFormRadioButtonText(buttonText.toUpperCase())).toHaveAttribute('current-checked', 'true')
    }

    /**
     * Verifies the input text and character count in the Prepare Deposition form.
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifyPrepareDepositionInput(): Promise<void> {
        await expect(this.depositionFormHeader).toHaveText('Prepare for a Deposition')
        const inputText = await this.skillFormInput.getAttribute('value').toString()
        await expect(this.inputCharacterCount).toHaveText(4000 - inputText.length + ' characters remaining')
    }

    /**
     * Submits a skill request with an optional query input for skills like Prepare Deposition, Review Documents, AAR, etc
     * @returns {Promise<void>} - A promise that resolves when the skill request submission process is complete.
     */
    async submitSkillRequest(): Promise<void> {
        await this.submitRequestButton.or(this.submitAARRequestButton).or(this.submitAskPLRequestButton).scrollIntoViewIfNeeded()
        await expect(this.submitRequestButton.or(this.submitAARRequestButton).or(this.submitAskPLRequestButton)).toBeVisible()
        if (await this.submitRequestButton.last().isVisible()) {
            await this.submitRequestButton.last().click()
        } else if (await this.submitAARRequestButton.last().isVisible()) {
            await this.submitAARRequestButton.last().click()
        } else if (await this.submitAskPLRequestButton.last().isVisible()) {
            await this.submitAskPLRequestButton.last().click()
        }
    }

    /**
     * Waits for a skill to complete by continuously checking the API response until a success status is received.
     *
     * @param {any} requestUrl - The URL to send the API request to.
     * @returns {Promise<void>} - A promise that resolves when the skill completes successfully.
     */
    async waitForSkillToCompleteAPI(requestUrl: any, maxTimeout: number = SKILL_TIMEOUT.LARGE_TIMEOUT): Promise<void> {
        const interval = 3000 // Check every 3 seconds
        const startTime = Date.now()

        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

        while (Date.now() - startTime < maxTimeout) {
            try {
                const response = await this.page.request.get(requestUrl)
                const respBody = await response.json()
                const statusCheck = respBody.status

                if (statusCheck === 'FAILED') {
                    throw new Error('Skill status is FAILED')
                } else if (statusCheck === 'SUCCESS') {
                    return // Success, exit the method
                } else if (statusCheck === 'USER_INPUT_REQUIRED') {
                    return // irrelevant skill results, exit the method
                }
            } catch (error) {
                throw error // Rethrow any error encountered during the request
            }

            // Wait for the specified interval before the next check
            await delay(interval)
        }

        // If the loop exits without returning, it means the status never became 'SUCCESS'
        throw new Error('Skill did not complete within the expected time.')
    }

    /**
     * Verifies successful skill card with the results ready message and view skills button.
     *
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifySuccessfulSkillCard(): Promise<void> {
        await expect(this.cancelSkillsButton.last()).not.toBeVisible()
        await expect(this.skillStatusSuccessText.last()).toBeVisible()
        await expect(this.viewSkillsButton.last()).toBeVisible()
    }

    /**
     * Verifies successful skill card with the results ready message and view skills button.
     *
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifySuccessfulLongContextSkill(citedSourceButtonText: string = 'View all cited sources'): Promise<void> {
        await expect(this.skillDownloadButton).toBeVisible()
        await expect(this.skillDownloadButton).toHaveText('Download')
        await expect(this.viewAllCitedSourcesButton).toBeVisible()
        await expect(this.viewAllCitedSourcesButton).toHaveText(citedSourceButtonText)
    }

    /**
     * Verifies skill card that has just been initiated- in progress state.
     *
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifySkillCardInProgress(): Promise<void> {
        await expect(this.skillProgressArea).toBeVisible()
        await expect(this.skillCardHeaderText).toBeVisible()
        await expect(this.skillCardHeaderText).toContainText('Your results are in progress')
        await expect(this.skillProgressText).toBeVisible()
        await expect(this.skillProgressValueText).toBeVisible()
        await expect(this.skillProgressBar).toBeVisible()
        await expect(this.cancelSkillsButton.last()).toBeVisible()
        await expect(this.viewSkillsButton.last()).toBeVisible()
    }

    /**
     * Verifies skill card that has just been initiated- in progress state.
     *
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifyLongContextSkillInProgress(skillName, responseText = 'Responding'): Promise<void> {
        await expect(this.skillResponseTitle.last()).toHaveText(skillName)
        await expect(this.respondingToSkillText).toContainText(responseText)
        await expect(this.respondingProgressBar).toBeVisible()
    }

    /**
     * Verifies skill card files sections for skills like Review document, ECD, etc with the number of files and the show more/less button.
     *
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifySkillCardFilesSection(numberOfFiles: number): Promise<void> {
        await expect(this.skillCardFilesText(numberOfFiles)).toBeVisible()
        const expectedCount = numberOfFiles > 3 ? 3 : numberOfFiles
        await expect(this.skillCardFiles).toHaveCount(expectedCount)
        await expect(this.skillCardFileIcons).toHaveCount(expectedCount)
        await expect(this.skillCardFileNames).toHaveCount(expectedCount)
        if (numberOfFiles > 3) {
            await expect(this.skillCardFilesShowMoreIcon).toHaveAttribute('icon-name', 'chevron-down')
            await expect(this.skillCardFilesShowMoreText((numberOfFiles - 3).toString())).toBeVisible()
        } else {
            await expect(this.skillCardFilesShowMoreIcon).not.toBeVisible()
        }
    }

    /**
     * Verifies skill card query type section having text like questions, description, request or summary type and the show more/less button.
     *
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifySkillCardQueryTypeSection(skillName: string, numberOfQuestionsOrPolicies: number = 1): Promise<void> {
        if (skillName == this.SKILL_NAME.REVIEW || skillName == this.SKILL_NAME.ECD) {
            await expect(this.skillCardQuestionsText(numberOfQuestionsOrPolicies)).toBeVisible()
            const expectedCount = numberOfQuestionsOrPolicies > 5 ? 5 : numberOfQuestionsOrPolicies
            await expect(this.skillCardQuestions).toHaveCount(expectedCount)
            if (numberOfQuestionsOrPolicies > 5) {
                await expect(this.skillCardQuestionsOrPoliciesShowMoreIcon).toHaveAttribute('icon-name', 'chevron-down')
                await expect(this.skillCardQuestionsOrPoliciesShowMoreOrLessText((numberOfQuestionsOrPolicies - 5).toString())).toBeVisible()
            } else {
                await expect(this.skillCardQuestionsOrPoliciesShowMoreIcon).not.toBeVisible()
            }
        } else if (skillName == this.SKILL_NAME.CPC) {
            await expect(this.skillCardPoliciesText(numberOfQuestionsOrPolicies)).toBeVisible()
            const expectedCount = numberOfQuestionsOrPolicies > 5 ? 5 : numberOfQuestionsOrPolicies
            await expect(this.skillCardQuestions).toHaveCount(expectedCount)
            if (numberOfQuestionsOrPolicies > 5) {
                await expect(this.skillCardQuestionsOrPoliciesShowMoreIcon).toHaveAttribute('icon-name', 'chevron-down')
                await expect(this.skillCardQuestionsOrPoliciesShowMoreOrLessText((numberOfQuestionsOrPolicies - 5).toString())).toBeVisible()
            } else {
                await expect(this.skillCardQuestionsOrPoliciesShowMoreIcon).not.toBeVisible()
            }
        } else if (skillName == this.SKILL_NAME.PREPARE_DEPO || skillName == this.SKILL_NAME.DRAFT_CORRESPONDENCE) {
            await expect(this.skillCardDescriptionText).toBeVisible()
            await expect(this.skillCardRequestOrDescriptionOrSummary).toBeVisible()
        } else if (skillName == this.SKILL_NAME.AAR || skillName == this.SKILL_NAME.ASK_PL || skillName == this.SKILL_NAME.TIMELINE || skillName == this.SKILL_NAME.SDB) {
            await expect(this.skillCardRequestText).toBeVisible()
            if (skillName !== this.SKILL_NAME.TIMELINE) {
                await expect(this.skillCardRequestOrDescriptionOrSummary).toBeVisible()
            }
        } else if (skillName == this.SKILL_NAME.SUMMARIZE) {
            await expect(this.skillCardSummaryTypeText).toBeVisible()
            await expect(this.skillCardRequestOrDescriptionOrSummary).toBeVisible()
        }
    }

    /**
     * Validates all chat page elements
     * @async
     * @returns {Promise<void>}
     */
    async validateChatPageElementsAfterQuestionsAsked(userId: string, coCounselVersion = 1.0, coCounsel = 'CoCounsel'): Promise<void> {
        await expect(this.userIdByText(userId)).toBeVisible()
        await expect(this.userChatTime(userId)).toBeVisible()
        await expect(this.userIdByText(coCounsel)).toBeVisible()
        await expect(this.userChatTime(coCounsel)).toBeVisible()
        await expect(this.chatInputField).toBeVisible()
        await expect(this.chatInputField).toBeEditable()
        if (coCounselVersion == 2.0) {
            await expect(this.activeVersion).toHaveText('Using CoCounsel 2.0')
        } else if (coCounselVersion == 1.0) {
            await expect(this.activeVersion).toHaveText('Using CoCounsel 1.0')
        }
    }

    /**
     * Validates the page elements after the skills card click
     * @async
     * @returns {Promise<void>}
     */
    async validateSkillsResponseElements(userId: string, coCounsel = 'CoCounsel', responseHeaders: string): Promise<void> {
        const headers = responseHeaders.split(' , ')
        await expect(this.userIdByText(userId)).toBeVisible()
        await expect(this.userChatTime(userId)).toBeVisible()
        await expect(this.userIdByText(coCounsel)).toBeVisible()
        await expect(this.userChatTime(coCounsel)).toBeVisible()
        headers.forEach(async (header) => {
            await expect(this.chatResponseHeader(header)).toBeVisible()
        })
    }

    /**
     * Validates new chat page elements
     * @async
     * @returns {Promise<void>}
     */
    async validateNewChatPageElements(userId: string): Promise<void> {
        await expect(this.longGeneralContext.chatModeButton).toBeVisible()
        await expect(this.longGeneralContext.chatModeButton).toHaveText('CoCounsel 2.0')
        await expect(this.page.getByText(`Welcome, ${userId}`).first()).toBeVisible()
        await expect(this.page.getByText('What would you like to do today?').first()).toBeVisible()
        await expect(this.researchCard).toBeVisible()
        await expect(this.reviewCard).toBeVisible()
        await expect(this.summarizeCard).toBeVisible()
        await expect(this.draftCard).toBeVisible()
        await expect(this.showAllSkillsLink).toBeVisible()
        await expect(this.chatInputField).toBeVisible()
        await expect(this.chatInputField).toBeEditable()
        await expect(this.sendButton).toHaveAttribute('disabled')
        await expect(this.uploadButton).toBeVisible()
        await expect(this.uploadButton).toBeEnabled()
        await expect(this.coCounselSkillsButton).toBeVisible()
        await expect(this.coCounselSkillsButton).toBeEnabled()
        await expect(this.learnMoreLink).toBeVisible()
    }

    /**
     * Validates the list of skills in the Show All Skills list
     * @async
     * @returns {Promise<void>}
     * @param {string} coCounselVersion - The version of CoCounsel to validate the skills list for.
     */
    async validateShowAllSkillsList(coCounselVersion = 1.0): Promise<void> {
        let allSkills: any = []
        if (coCounselVersion === 2.0) {
            //TODO: Add CPC skill to the list when it is activated
            allSkills = [
                'Search a Database',
                'AI-Assisted Research',
                `Search & Summarize Practical Law ${region.toUpperCase()}`,
                'Review Documents',
                'Compare Documents',
                'Summarize',
                'Timeline',
                'Draft',
                'Prepare for a Deposition'
            ]
        } else {
            allSkills = [
                'Search a Database',
                'AI-Assisted Research',
                `Search & Summarize Practical Law ${region.toUpperCase()}`,
                'Review Documents',
                'Contract Policy Compliance',
                'Extract Contract Data',
                'Summarize',
                'Timeline',
                'Draft',
                'Prepare for a Deposition'
            ]
        }
        await expect(this.showAllSkillsListButton).toHaveCount(allSkills.length)
        const count = await allSkills.length
        const skillNames = await this.showAllSkillButtons.allTextContents()
        for (let i = 0; i < count; i++) {
            await expect(allSkills).toContain(skillNames[i])
        }
    }

    /**
     * Opens upload from device panel from current active chat
     * @async
     * @returns {Promise<void>}
     */
    async openUploadFromDevicePanel() {
        await expect(this.uploadButton).toBeVisible()
        await this.uploadButton.click()
        await expect(this.filesFromYourDeviceButton).toBeVisible()
        await this.filesFromYourDeviceButton.click()
    }

    /**
     * Verifies successful long context skill started
     * and it shows progress bar
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifyLCSkillInProgress(skillName: string) {
        await expect(this.longContext.skillTitle.last()).toHaveText(skillName)
        await expect(this.longContext.skillProgressBar).toBeVisible()
        await expect(this.longContext.skillProgressBar).toContainText('Responding...', { timeout: 120000 })
    }

    /**
     * Verifies successful long context skill
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifyLCSkillSuccess(skillId: string, flowId: string, documentUpload: boolean = true): Promise<void> {
        await expect(this.longContext.downloadMenuButton.last()).toBeVisible()
        if (documentUpload) {
            await expect(this.longContext.viewCitedSourcesButton(skillId, flowId)).toBeVisible()
        }
        await expect(this.longContext.skillResponseFeedback.last()).toBeVisible()
    }

    /**
     * Verifies that the long context last skill card's name matches AAR skill name.
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifyLongContextAARSkillCard(skillName = this.SKILL_NAME.AAR): Promise<void> {
        if (skillName == this.SKILL_NAME.AAR) {
            await expect(this.longContext.submitAARRequestButton).toBeVisible({ timeout: 60000 })
            await expect(this.aarRadioButton).toHaveAttribute('current-checked', 'true')
        } else {
            await expect(this.longContext.submitAskPLRequestButton).toBeVisible()
            await expect(this.askPLRadioButton).toHaveAttribute('current-checked', 'true')
        }
        await this.skillCardName.last().scrollIntoViewIfNeeded()
        await expect(this.skillCardName.last()).toBeVisible()
        await expect(this.skillCardName.last()).toContainText(`Skill: ${skillName}`)
        await expect(this.aarRadioButton).toBeVisible()
        await expect(this.askPLRadioButton).toBeVisible()
    }

    /**
     * Verifies that long context AI Assisted Research skill started to process
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifyLongContextAARSkillInProgress(skillName = this.SKILL_NAME.AAR, responseText = 'Responding'): Promise<void> {
        await expect(this.longContext.skillTitle.last()).toHaveText(skillName)
        await expect(this.respondingToSkillText).toContainText(responseText)
        await expect(this.respondingProgressBar).toBeVisible()
    }

    /**
     * Verifies that long context AI Assisted Research skill completed successfully
     * @returns {Promise<void>} - A promise that resolves when the verification is complete.
     */
    async verifyLongContextAARSkillSuccess(flowId: string, skillName = this.SKILL_NAME.AAR, skillID = LC_SKILL_ID.AAR): Promise<void> {
        await expect(this.longContext.skillTitle.last()).toHaveText(skillName)
        await expect(this.longContext.askFollowUpQuestionButton.last()).toBeVisible()
        await expect(this.longContext.askFollowUpQuestionButton.last()).not.toHaveAttribute('disabled')
        await expect(this.longContext.downloadMenuButton.last()).toBeVisible()
        await expect(this.longContext.skillResponseFeedback.last()).toBeVisible()
        await expect(this.longContext.viewCitedSourcesButton(skillID, flowId)).toBeVisible()
    }
}
