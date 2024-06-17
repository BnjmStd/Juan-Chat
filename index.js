import { CreateMLCEngine } from 'https://esm.run/@mlc-ai/web-llm'

const $ = el => document.querySelector(el)
const $form = $('form')
const $input = $('input')
const $template = $('#message-template')
const $messages = $('ul')
const $container = $('main')
const $button = $('button')
const $info = $('small')


let messages = []


const SELECTED_MODEL = 'gemma-2b-it-q4f32_1-MLC'

const engine = await CreateMLCEngine (
    SELECTED_MODEL,
    {
        initProgressCallback: (info) => {
            console.log('initProgressCallback', info)
            $info.textContent = `${info.text}`
            if (info.progress == 1) {
                $button.removeAttribute('disabled')
            }
        }
    }
)


$form.addEventListener('submit', async (event) => {
    event.preventDefault()
    

    const messageText = $input.value.trim()

    if (messageText !== '') {
        $input.value = ''
    }

    addMessage(messageText, 'user')
    $button.setAttribute('disabled', true)


    const userMessage = {
        role: 'user',
        content: messageText
    }

    messages.push(userMessage)

    const reply = await engine.chat.completions.create(
        {
            messages
        }
    )

    const botMessage = reply.choices[0].message
    messages.push(botMessage)
    addMessage(botMessage.content, 'bot')
})

function addMessage(text, sender) {
    // clonamos el template
    const clonedTemplate = $template.content.cloneNode(true)

    const $newMessage = clonedTemplate.querySelector('.message')
    const $who = $newMessage.querySelector('span')
    const $text = $newMessage.querySelector('p')

    $text.textContent = text
    $who.textContent = sender == 'bot' ? 'GPT' : 'Tú'

    $newMessage.classList.add(sender)
    $messages.appendChild($newMessage)


     // scroll
     $container.scrollTop = $container.scrollHeight
}