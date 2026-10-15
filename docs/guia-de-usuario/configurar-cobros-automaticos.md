---
title: Configurar la cobranza automática
description: Cómo decirle a Billy cuándo cobrar, qué tono usar y qué mensaje enviar.
sidebar_label: Configurar la cobranza
---

Desde **Cuenta → Cobranza automática** ajustas cómo Billy les escribe a tus deudores. No necesitas hacer nada más: una vez guardas estos ajustes, Billy sigue cobrando solo.

:::info[Billy no empieza a cobrar hasta que completes esto]
Si falta la **fecha de inicio** o la **frecuencia de cobros**, Billy no envía nada todavía. La app te lo recuerda con un aviso en Ajustes generales hasta que completes los dos datos.
:::

## Ajustes generales

| Dato | Para qué sirve |
|---|---|
| Correo remitente | El correo desde el que tus deudores reciben los recordatorios |
| Próximo lote de cobros | La fecha en que Billy empieza a enviar (como mínimo, desde mañana) |
| Frecuencia de cobros (días) | Cada cuántos días Billy vuelve a escribirle a un deudor |
| Link de pago | El enlace que tus deudores usan para pagarte, incluido en los mensajes |
| Link del Excel en Drive | Si llevas tus facturas en una hoja de Excel compartida |
| Correo, celular y WhatsApp de prueba | Para enviarte a ti mismo un ejemplo de cómo se ve el mensaje |
| "La mayoría de mis clientes son empresas" | Ajusta el lenguaje de los mensajes según a quién le cobras |

## Tonos y canales

Billy puede escribir con distintos **tonos** según qué tan urgente sea el cobro: **Amigable**, **Formal**, **Exigente** y **Con plantilla** (este último usa tu propia plantilla de correo, sin tono predefinido).

Para cada tono eliges por qué canales se envía: **correo**, **SMS** y/o **WhatsApp**. Activa o desactiva cada tono y cada canal según lo que prefieras.

## Plantilla de correo

Puedes escribir tu propio mensaje de correo para que Billy lo use en lugar del texto predeterminado. Para personalizarlo con los datos de cada factura, inserta estas variables donde quieras que aparezca el dato (toca la variable y se inserta donde tengas el cursor):

| Variable | Se reemplaza por |
|---|---|
| `{client_name}` | Nombre del deudor |
| `{client_email}` | Correo del deudor |
| `{client_phone}` | Teléfono del deudor |
| `{invoice_number}` | Número de la factura |
| `{invoice_due_date}` | Fecha de vencimiento |
| `{invoice_stage}` | Etapa de cobro |
| `{invoice_days_outstanding}` | Días en mora |
| `{invoice_amount}` | Valor de la factura |
| `{current_date}` | Fecha de hoy |

:::caution[Al guardar desde la app se pierde el formato]
Si tu plantilla tiene negritas, enlaces o listas, al guardarla desde la app se convierte en texto simple (se mantiene el contenido, pero no el formato). Si quieres conservar el formato original, edita la plantilla desde la página web.
:::

## Imágenes

Puedes subir tres imágenes desde tu galería: la **cabecera** del correo, tu **firma** y el **avatar** que representa a Billy en los mensajes. Al tocar cada una, la app te pide permiso para abrir tu galería; elige la foto y se sube sola.
