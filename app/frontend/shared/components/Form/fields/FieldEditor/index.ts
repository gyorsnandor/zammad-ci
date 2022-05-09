// Copyright (C) 2012-2022 Zammad Foundation, https://zammad-foundation.org/

import FieldEditorWrapper from '@shared/components/Form/fields/FieldEditor/FieldEditorWrapper.vue'
import createInput from '@shared/form/core/createInput'
import { FormKitExtendableSchemaRoot, FormKitNode } from '@formkit/core'
import { cloneDeep } from 'lodash-es'

function addAriaLabel(node: FormKitNode) {
  const { props } = node

  if (!props.definition) return

  const definition = cloneDeep(props.definition)

  const originalSchema = definition.schema as FormKitExtendableSchemaRoot

  // Specification doesn't allow accessing non-labeled elements, which Editor is (<div />)
  // (https://html.spec.whatwg.org/multipage/forms.html#category-label)
  // So, editor has `aria-labelledby` attribute and a label with the same ID
  definition.schema = (definition) => {
    const localDefinition = {
      ...definition,
      label: {
        attrs: {
          id: props.id,
        },
      },
    }
    return originalSchema(localDefinition)
  }

  props.definition = definition
}

const fieldDefinition = createInput(FieldEditorWrapper, [], {
  features: [addAriaLabel],
})

export default {
  fieldType: 'editor',
  definition: fieldDefinition,
}