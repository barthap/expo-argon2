package expo.community.modules.argon2

import android.util.Base64
import com.lambdapioneer.argon2kt.Argon2Kt
import com.lambdapioneer.argon2kt.Argon2KtResult
import expo.modules.core.errors.InvalidArgumentException
import expo.modules.kotlin.apifeatures.EitherType
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.Either
import expo.modules.kotlin.types.Enumerable


enum class SaltEncoding(val encoding: String) : Enumerable {
  HEX("hex"),
  UTF8("utf8"),
  BASE64("base64")
}

enum class Argon2Mode(val mode: String) : Enumerable {
  ARGON2_I("argon2i"),
  ARGON2_D("argon2d"),
  ARGON2_ID("argon2id");

  fun getArgon2Mode(): com.lambdapioneer.argon2kt.Argon2Mode =
    when (this) {
      ARGON2_I -> com.lambdapioneer.argon2kt.Argon2Mode.ARGON2_I
      ARGON2_D -> com.lambdapioneer.argon2kt.Argon2Mode.ARGON2_D
      ARGON2_ID -> com.lambdapioneer.argon2kt.Argon2Mode.ARGON2_ID
    }
}

class Argon2Config: Record {
  @Field
  val iterations: Int = 2

  @Field
  val memory: Int = 32 * 1024

  @Field
  val parallelism: Int = 1

  @Field
  val hashLength: Int = 32

  @Field
  val saltEncoding: SaltEncoding = SaltEncoding.UTF8

  @Field
  val mode: Argon2Mode = Argon2Mode.ARGON2_ID
}

class ExpoArgon2Module : Module() {
  private val argon2Kt: Argon2Kt by lazy { Argon2Kt() }

  @OptIn(ExperimentalStdlibApi::class, EitherType::class)
  override fun definition() = ModuleDefinition {
    Name("ExpoArgon2")

    AsyncFunction("hashAsync") { password: Either<String, ByteArray>, salt: String, config: Argon2Config ->
      try {
        val passwordBytes: ByteArray = when {
          password.`is`(String::class) -> password.get(String::class).toByteArray(Charsets.UTF_8)
          password.`is`(ByteArray::class) -> password.get(ByteArray::class)
          else -> throw Exceptions.IllegalArgument("Invalid password data format")
        }

        val saltBytes: ByteArray = when (config.saltEncoding) {
          SaltEncoding.UTF8 -> salt.toByteArray(Charsets.UTF_8)
          SaltEncoding.BASE64 -> Base64.decode(salt, Base64.NO_WRAP)
          SaltEncoding.HEX -> salt
            .lowercase()
            .substringAfter("0x")
            .hexToByteArray(HexFormat.Default)
        }

        val hashResult: Argon2KtResult = argon2Kt.hash(
          config.mode.getArgon2Mode(),
          passwordBytes,
          saltBytes,
          config.iterations,
          config.memory,
          config.parallelism,
          config.hashLength
        )
        val rawHash = hashResult.rawHashAsHexadecimal(false)
        val encodedHash = hashResult.encodedOutputAsString()

        return@AsyncFunction mapOf(
          "rawHash" to rawHash,
          "encodedHash" to encodedHash
        )
      } catch (exception: Exception) {
        throw CodedException("Failed to generate argon2 hash: ${exception.message}", exception)
      }
    }
  }
}
